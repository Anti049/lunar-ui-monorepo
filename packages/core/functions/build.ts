/*
	The compiler.

	Reads src/**\/*.css, compiles it through the real Tailwind CLI, works out
	which rules each component contributed, converts those to JavaScript objects
	and writes them to generated/. Nothing here ships — tsconfig.build.json
	deliberately excludes functions/, except for the runtime modules the entry
	points import.
*/
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { extractClasses } from './extract-classes.js';
import { partition } from './partition.js';
import {
	collectDeclarations,
	buildThemeExtend,
	inlineThemeFallbacks,
	resolveClosure
} from './collect-tokens.js';
import { buildSwatches, modeMapping } from './extract-swatches.js';
import { extractCustomVariants } from './extract-variants.js';
import { extractFunctional } from './extract-functional.js';
import type { Bundle } from '../types.js';

const require = createRequire(import.meta.url);
const pkgRoot = path.resolve(import.meta.dirname, '..');
const coreSrc = path.join(pkgRoot, 'src');
const componentsDir = path.join(coreSrc, 'components');
const generatedDir = path.join(pkgRoot, 'generated');
const tmpDir = path.join(pkgRoot, '.tmp');

/*
	Resolve the Tailwind CLI out of THIS package's node_modules rather than
	assuming a global install. A global copy on a different minor version
	produces output that disagrees with the test harness, subtly enough to cost
	hours.
*/
const cliEntry = path.join(
	path.dirname(require.resolve('@tailwindcss/cli/package.json')),
	'dist/index.mjs'
);

/** Forward slashes, so generated @import paths are identical on every OS. */
const toPosix = (p: string): string => p.split(path.sep).join('/');
const relFromTmp = (target: string): string => toPosix(path.relative(tmpDir, target));

/** Every `--name` a string references. */
const referencedVariables = (text: string): string[] =>
	[...text.matchAll(/var\(\s*(--[-\w]+)/g)].map((m) => m[1]);

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
		throw new Error(`tailwind failed on ${label}:\n${detail.replace(/\x1b\[[0-9;]*m/g, '')}`, {
			cause: error
		});
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
	Names like `collapse`, `table` and `select-text` are Tailwind's. Claiming one
	pulls Tailwind's rule into your bundle, where it will fight the consumer's
	own utilities.

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

/*
	The allowlist a `prefix` renames against. Classes come from what survived
	built-in detection; variables are collected in section 6 once the
	declarations have been read, and merged in before emission.

	An ALLOWLIST rather than a denylist: a name is renamed only when this design
	system actually defines it, so Tailwind's own theme variables and a
	consumer's state hooks are left alone by construction.
*/
const registryClasses = [...classOwners.keys()].sort();

/*
	Functional utilities — `@utility name-*`. These have no finite set of class
	names, so they cannot be safelisted and cannot survive the compile. Read
	from source instead, and re-registered at runtime by index.ts through
	matchUtilities.
*/
const FUNCTIONAL = componentFiles.flatMap((file) =>
	extractFunctional(fs.readFileSync(file, 'utf8'), path.basename(file, '.css'))
);

/*
	`@custom-variant` blocks. Hand-listing these once shipped one of three, and
	the two that were missing went unnoticed for months — guide 12 now asserts
	the count against the source.
*/
const CUSTOM_VARIANTS = extractCustomVariants(coreSrc);

// ---------------------------------------------------------------------------
// 4. Compile the context and the components together, once.
// ---------------------------------------------------------------------------

const contextPath = path.join(import.meta.dirname, 'context.css');

const compiled = runTailwind(
	[
		`@import '${relFromTmp(contextPath)}';`,
		...componentFiles.map((f) => `@import '${relFromTmp(f)}';`),
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
// 6. Collect the design tokens. (Guide 14.)
// ---------------------------------------------------------------------------

/*
	Shape tokens: the knobs a consumer may turn.
*/
const SHAPE_TOKENS: Record<string, string> = {
	'--radius-selector': '0.5rem',
	'--radius-field': '0.5rem',
	'--radius-box': '1rem',
	'--size-selector': '1.5rem',
	'--size-field': '2.5rem',
	'--border-width': '1px',
	'--animation-duration': '200ms',
	'--animation-easing': 'var(--ease-standard)'
};

/*
	Settable but deliberately NOT declared. `--radius-button` exists only as a
	fallback written at the point of use:

	    border-radius: var(--radius-button, var(--radius-field));

	Give it a `:root` default instead and a var() resolves WHERE IT IS DECLARED,
	so the root's --radius-field is substituted once and a [data-theme] override
	never reaches buttons. The chain looks right and silently is not.
*/
const DERIVED_SHAPE_TOKENS: Record<string, string> = {
	'--radius-button': '--radius-field' // token -> what it falls back to
};

/** Every shape token a consumer may set, declared or not. */
const SETTABLE_SHAPE_TOKENS = [...Object.keys(SHAPE_TOKENS), ...Object.keys(DERIVED_SHAPE_TOKENS)];

const declarations = collectDeclarations(coreSrc);
const { extend: themeExtend, claimed } = buildThemeExtend(declarations);

// The seeds: every variable the compiled CSS references, plus every variable
// the shape tokens reference.
const seeds = new Set(referencedVariables(compiled));
for (const v of referencedVariables(Object.values(SHAPE_TOKENS).join(' '))) seeds.add(v);
const needed = resolveClosure(seeds, declarations);

/*
	A theme is identified by its source DIRECTORY when it has flavours
	(catppuccin/mocha.css and its three siblings are all `catppuccin`), otherwise
	by file name. This is why `file` is carried on every collected declaration.
*/
const themeIdOf = (file: string): string | null => {
	if (!file.startsWith('themes/')) return null;
	const rest = file.slice('themes/'.length);
	const slash = rest.indexOf('/');
	return slash === -1 ? rest.replace(/\.css$/, '') : rest.slice(0, slash);
};

const baseRules: Record<string, Record<string, string>> = {};
const themeRules: Record<string, Record<string, Record<string, string>>> = {};

const addTo = (
	target: Record<string, Record<string, string>>,
	selector: string,
	prop: string,
	value: string
): void => {
	target[selector] ??= {};
	target[selector][prop] = value;
};

const addDecl = (file: string, selector: string, prop: string, value: string): void => {
	const themeId = themeIdOf(file);
	if (themeId === null) {
		addTo(baseRules, selector, prop, value);
		return;
	}
	themeRules[themeId] ??= {};
	addTo(themeRules[themeId], selector, prop, value);
};

for (const decl of declarations) {
	if (decl.scope === 'color-scheme') {
		addDecl(decl.file, decl.selector, decl.prop, decl.value);
		continue;
	}
	if (decl.scope === 'theme') {
		// Claimed by a theme namespace, so Tailwind emits it when used. Anything
		// unclaimed still needs carrying, but only if the bundles depend on it.
		if (claimed.has(decl.prop) || !needed.has(decl.prop)) continue;
		addDecl(decl.file, ':root', decl.prop, decl.value);
		continue;
	}
	if (!needed.has(decl.prop)) continue;
	addDecl(decl.file, decl.selector, decl.prop, decl.value);
}

// Shape tokens sit alongside the rest of the base layer, at :root.
for (const [prop, value] of Object.entries(SHAPE_TOKENS)) addTo(baseRules, ':root', prop, value);

/*
	Base declarations can themselves reach into namespaced tokens — e.g.
	`--animation-easing: var(--ease-standard)` — so they need the same fallback
	treatment as the bundle CSS.
*/
const themeValues = new Map(
	declarations.filter((d) => d.scope === 'theme').map((d) => [d.prop, d.value])
);
const resolvedBaseRules = inlineThemeFallbacks(baseRules, themeValues);
const resolvedThemeRules = inlineThemeFallbacks(themeRules, themeValues);

// ---------------------------------------------------------------------------
// 7. Build the theme catalogue. (This guide.)
// ---------------------------------------------------------------------------

/*
	Read the role-to-tone-step mapping out of modes.css rather than hard-coding
	it. That both avoids drift and gives you a build-time assertion that the mode
	layer is intact: re-point a role and either the mapping follows or the build
	fails with a message naming the role.
*/
const swatchModeMap = modeMapping(fs.readFileSync(path.join(coreSrc, 'base/modes.css'), 'utf8'));
const swatches = buildSwatches(resolvedThemeRules, swatchModeMap);

// ---------------------------------------------------------------------------
// 8. Emit generated/.
// ---------------------------------------------------------------------------

/*
	Written as .ts, not .js, so tsc typechecks the generated data against the
	same types the hand-written runtime uses. A shape change in the generator
	then fails the build instead of failing at a consumer's runtime.
*/
const BANNER = '/* Generated by functions/build.ts. Do not edit. */\n';

/** Writes one generated module, optionally importing a type for its value. */
function writeGenerated(file: string, value: unknown, type: string, importType?: string): void {
	const imports = importType ? `import type { ${importType} } from '../types.js';\n\n` : '';
	fs.writeFileSync(
		path.join(generatedDir, file),
		BANNER +
			imports +
			`const value: ${type} = ${JSON.stringify(value, null, '\t')};\n\n` +
			`export default value;\n`
	);
}

fs.rmSync(generatedDir, { recursive: true, force: true });
fs.mkdirSync(path.join(generatedDir, 'components'), { recursive: true });

for (const [name, raw] of Object.entries(components) as [string, Bundle][]) {
	/*
		Theme-namespace tokens (`--color-primary`) are left to Tailwind to emit,
		and a plugin-only build never emits them: theme.extend registers the
		utilities, not the variables. The inlined fallback is what resolves them.
	*/
	const bundle = inlineThemeFallbacks(raw, themeValues);
	const dir = path.join(generatedDir, 'components', name);
	fs.mkdirSync(dir, { recursive: true });

	fs.writeFileSync(
		path.join(dir, 'object.ts'),
		BANNER +
			`import type { StyleObject } from '../../../types.js';\n\n` +
			`export const utilities: StyleObject = ${JSON.stringify(bundle.utilities, null, '\t')};\n\n` +
			`export const standalone: StyleObject = ${JSON.stringify(bundle.standalone, null, '\t')};\n\n` +
			`export const unconditional: StyleObject = ${JSON.stringify(bundle.unconditional, null, '\t')};\n`
	);

	/*
		The registrar. Generated rather than written once and reused, because each
		bundle's data is a separate module — which is what lets a consumer's
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

/** A component name as a valid JS identifier: `code-block` -> `codeBlock`. */
function ident(name: string): string {
	return name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
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

/*
	A component-local variable is one the component DECLARES, not merely one it
	mentions. Going by references would sweep up typos — a var() naming a token
	that does not exist anywhere — and then rename them under a prefix, which
	quietly breaks the "theme variables are never prefixed" guarantee for
	anything named `--color-*`.
*/
const registryVariables = [
	...new Set(
		declarations
			.filter((d) => d.scope === 'rule' && themeIdOf(d.file) === null)
			.map((d) => d.prop.slice(2))
	)
].sort();

const registry = { classes: registryClasses, variables: registryVariables };

writeGenerated('registry.ts', registry, 'Registry', 'Registry');
writeGenerated('variants.ts', CUSTOM_VARIANTS, 'Record<string, string | string[]>');
writeGenerated('functional.ts', FUNCTIONAL, 'FunctionalUtility[]', 'FunctionalUtility');
writeGenerated('properties.ts', properties, 'StyleObject', 'StyleObject');
writeGenerated('theme.ts', themeExtend, 'ThemeExtend', 'ThemeExtend');
writeGenerated('base.ts', resolvedBaseRules, 'Record<string, Record<string, string>>');
writeGenerated('themes.ts', resolvedThemeRules, 'ThemeRules', 'ThemeRules');
writeGenerated('shape.ts', SETTABLE_SHAPE_TOKENS, 'string[]');
writeGenerated('swatches.ts', swatches, 'Record<string, ThemeSwatches>', 'ThemeSwatches');
writeGenerated('mode-map.ts', swatchModeMap, 'Record<SwatchRole, [string, string]>', 'SwatchRole');

console.log(
	`built ${names.length} bundles: ${names.join(', ')}\n` +
		`${needed.size} tokens in closure, ${Object.keys(themeRules).length} themes ` +
		`(${Object.keys(themeRules).join(', ')})\n` +
		`theme catalogue: ${Object.keys(swatches).length} names, ` +
		`${Object.keys(CUSTOM_VARIANTS).length} variants, ${FUNCTIONAL.length} functional utilities`
);
