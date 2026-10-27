/*
	The compiler.

	Reads src/**\/*.css, compiles it through the real Tailwind CLI, works out
	which rules each component contributed, converts those to JavaScript objects
	and writes them to generated/. Nothing here ships — tsconfig.build.json
	deliberately excludes functions/.

	Run it with `bun functions/build.ts`, or `bun run build`, which also cleans
	dist/ and runs tsc afterwards.
*/
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { extractClasses } from './extract-classes.js';
import { partition } from './partition.js';
import type { Bundle } from '../types.js';

// import.meta.dirname is functions/, so the package root is one level up.
const require = createRequire(import.meta.url);
const pkgRoot = path.resolve(import.meta.dirname, '..');
const coreSrc = path.join(pkgRoot, 'src');
const componentsDir = path.join(coreSrc, 'components');
const generatedDir = path.join(pkgRoot, 'generated');
const tmpDir = path.join(pkgRoot, '.tmp');

/*
	Resolve the Tailwind CLI out of THIS package's node_modules rather than
	assuming a global install. A global copy on a different minor version
	produces output that disagrees with the test harness, and the disagreement
	is subtle enough to cost hours.
*/
const cliEntry = path.join(
	path.dirname(require.resolve('@tailwindcss/cli/package.json')),
	'dist/index.mjs'
);

/** Forward slashes, so generated @import paths are identical on every OS. */
const toPosix = (p: string): string => p.split(path.sep).join('/');
const relFromTmp = (target: string): string => toPosix(path.relative(tmpDir, target));

/**
 * Compiles one CSS string and returns the result.
 *
 * Input and output are written to .tmp/<label>.{in,out}.css, which is the whole
 * reason for using the CLI rather than the programmatic API: when something
 * looks wrong there is a real file to open.
 */
function runTailwind(input: string, label: string): string {
	const inFile = path.join(tmpDir, `${label}.in.css`);
	const outFile = path.join(tmpDir, `${label}.out.css`);
	fs.mkdirSync(tmpDir, { recursive: true });
	fs.writeFileSync(inFile, input);
	try {
		execFileSync(process.execPath, [cliEntry, '-i', inFile, '-o', outFile], { stdio: 'pipe' });
	} catch (error) {
		const detail = (error as { stderr?: Buffer }).stderr?.toString() ?? '';
		// Strip ANSI colour codes, or the message is unreadable in a log file.
		// eslint-disable-next-line no-control-regex
		throw new Error(`tailwind failed on ${label}:\n${detail.replace(/\x1b\[[0-9;]*m/g, '')}`);
	}
	return fs.readFileSync(outFile, 'utf8');
}

// ---------------------------------------------------------------------------
// 1. Find the component stylesheets.
// ---------------------------------------------------------------------------

/*
	Sorted, because readdirSync order is filesystem-dependent. Unsorted, the
	generated output reorders between machines and every diff is noise.
*/
const componentFiles = fs
	.readdirSync(componentsDir)
	.filter((f) => f.endsWith('.css') && f !== '_index.css')
	.sort()
	.map((f) => path.join(componentsDir, f));

const componentNames = componentFiles.map((f) => path.basename(f, '.css'));

// ---------------------------------------------------------------------------
// 2. Build the safelist, and record which bundle owns each class.
// ---------------------------------------------------------------------------

/*
	`source(none)` means nothing is scanned, so every class the compile should
	emit has to be named explicitly. Deriving the list from source is the whole
	point — a hand-maintained equivalent ships incomplete and nobody notices
	until a consumer reports a missing class.
*/
const classOwners = new Map<string, string>();
const allClasses: string[] = [];

for (const file of componentFiles) {
	const name = path.basename(file, '.css');
	const css = fs.readFileSync(file, 'utf8');
	for (const className of extractClasses(css, name)) {
		classOwners.set(className, name);
		allClasses.push(className);
	}
}

// ---------------------------------------------------------------------------
// 3. Drop Tailwind's own class names.
// ---------------------------------------------------------------------------

/*
	Names like `collapse`, `table` and `select-text` are Tailwind's. Claiming
	one pulls Tailwind's rule into your bundle, where it will fight the
	consumer's own utilities.

	Probe with BARE Tailwind and none of your CSS loaded: whatever answers is
	Tailwind's. Running this against the full context instead reports every
	shared utility as a built-in — dozens of false positives.
*/
const builtinCss = runTailwind(
	["@import 'tailwindcss' source(none);", ...allClasses.map((c) => `@source inline("${c}");`)].join(
		'\n'
	),
	'builtins'
);

const builtins = new Set<string>();
for (const match of builtinCss.matchAll(/^\s*\.([-\w]+)\s*(?:,|\{)/gm)) {
	if (classOwners.has(match[1])) builtins.add(match[1]);
}
for (const name of builtins) classOwners.delete(name);

if (builtins.size) {
	console.log(`skipping ${builtins.size} Tailwind built-ins: ${[...builtins].sort().join(', ')}`);
}

const safelist = [...classOwners.keys()].sort().map((c) => `@source inline("${c}");`);

// ---------------------------------------------------------------------------
// 4. Compile the context and the components together, once.
// ---------------------------------------------------------------------------

const contextPath = path.join(import.meta.dirname, 'context.css');

const compiled = runTailwind(
	[
		`@import '${relFromTmp(contextPath)}';`,
		...componentFiles.map((f) => `@import '${relFromTmp(f)}';`),
		// @utility output is emitted on demand, so without the safelist the
		// compile comes back with none of your components in it.
		...safelist
	].join('\n'),
	'library'
);

/*
	A cheap sanity check that the compile actually resolved. If `@apply` survived
	into the output, something failed silently upstream and every downstream step
	would work on nonsense.
*/
if (compiled.includes('@apply')) {
	throw new Error('compile left @apply in the output — the context did not resolve');
}

// ---------------------------------------------------------------------------
// 5. Partition into bundles — which is also what subtracts the context.
// ---------------------------------------------------------------------------

/*
	There is no separate "subtract the context" step, and there must not be one.

	partition() attributes every top-level node to a bundle by its @layer marker,
	its keyframe name, or the classes it defines. Anything it cannot attribute —
	Tailwind's preflight, the theme layer, the tokens from src/base — is context
	by definition, and is dropped. Attribution IS the subtraction.

	Do not be tempted to diff the compiled text against a context-only compile.
	CSS is not line-oriented: removing a matched selector line leaves its
	declarations and closing brace behind, and postcss then fails with
	"Unexpected }" on the next parse.
*/
const { components, properties, unattributed } = partition(compiled, componentNames, classOwners);

/*
	Report what was dropped. A rule silently lost as "context" is the failure
	mode here: the build stays green and a component ships without one of its
	rules. A count makes it visible; read the list when it changes.
*/
if (unattributed.length) {
	console.log(`${unattributed.length} unattributed rules dropped as context:`);
	for (const item of unattributed.slice(0, 10)) console.log(`  ${item}`);
	if (unattributed.length > 10) console.log(`  … and ${unattributed.length - 10} more`);
}

// ---------------------------------------------------------------------------
// 6. Emit generated/.
// ---------------------------------------------------------------------------

/*
	Written as .ts, not .js, so tsc typechecks the generated data against the
	same `Bundle` type the hand-written runtime uses. A shape change in the
	generator then fails the build instead of failing at a consumer's runtime.
*/
const BANNER = '/* Generated by functions/build.ts. Do not edit. */\n';

fs.rmSync(generatedDir, { recursive: true, force: true });
fs.mkdirSync(path.join(generatedDir, 'components'), { recursive: true });

for (const [name, bundle] of Object.entries(components) as [string, Bundle][]) {
	const dir = path.join(generatedDir, 'components', name);
	fs.mkdirSync(dir, { recursive: true });

	// The data.
	fs.writeFileSync(
		path.join(dir, 'object.ts'),
		BANNER +
			`import type { StyleObject } from '../../../types.js';\n\n` +
			`export const utilities: StyleObject = ${JSON.stringify(bundle.utilities, null, '\t')};\n\n` +
			`export const standalone: StyleObject = ${JSON.stringify(bundle.standalone, null, '\t')};\n\n` +
			`export const unconditional: StyleObject = ${JSON.stringify(bundle.unconditional, null, '\t')};\n`
	);

	/*
		The registrar. Generated rather than written once and reused, because
		each bundle's data is a separate module — which is what lets a consumer's
		bundler drop the ones `exclude` skipped.
	*/
	fs.writeFileSync(
		path.join(dir, 'index.ts'),
		BANNER +
			`import { nestCssLayers } from '../../../functions/nestCssLayers.js';\n` +
			`import type { BundleRegistrar } from '../../../types.js';\n` +
			`import { utilities, standalone, unconditional } from './object.js';\n\n` +
			`const register: BundleRegistrar = ({ addUtilities, addBase }) => {\n` +
			`\tif (Object.keys(utilities).length) addUtilities(nestCssLayers(utilities));\n` +
			`\tif (Object.keys(standalone).length) addBase(standalone);\n` +
			`\tif (Object.keys(unconditional).length) addBase(unconditional);\n` +
			`};\n\nexport default register;\n`
	);
}

// The barrel index.ts imports: bundle name -> registrar.
const names = Object.keys(components).sort();
fs.writeFileSync(
	path.join(generatedDir, 'imports.ts'),
	BANNER +
		`import type { BundleRegistrar } from '../types.js';\n` +
		names.map((n) => `import ${ident(n)} from './components/${n}/index.js';`).join('\n') +
		`\n\nconst bundles: Record<string, BundleRegistrar> = {\n` +
		names.map((n) => `\t'${n}': ${ident(n)}`).join(',\n') +
		`\n};\n\nexport default bundles;\n`
);

// @property registrations, global and unconditional.
fs.writeFileSync(
	path.join(generatedDir, 'properties.ts'),
	BANNER +
		`import type { StyleObject } from '../types.js';\n\n` +
		`const value: StyleObject = ${JSON.stringify(properties, null, '\t')};\n\n` +
		`export default value;\n`
);

/** A component name as a valid JS identifier: `code-block` -> `codeBlock`. */
function ident(name: string): string {
	return name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

console.log(`built ${names.length} bundles: ${names.join(', ')}`);
