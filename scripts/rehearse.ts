/*
	Packs every publishable package, installs the tarballs into a scratch
	project outside the repository, and asserts that each feature survives the
	trip. Run before any release you are nervous about:

	    bun run rehearse

	Uses TARBALLS rather than `bun link` on purpose: a link resolves to the
	working tree and hides an empty `files` array, a wrong `exports` map, and a
	`dist/` that `.gitignore` excluded from the pack.
*/
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(import.meta.dirname, '..');
const scratch = path.join(os.tmpdir(), 'lunar-ui-rehearsal');
const packDir = path.join(scratch, 'pkgs');
const app = path.join(scratch, 'app');

const PACKAGES = ['core', 'svelte', 'react', 'vue'];

/** Runs a command, echoing it, and throws with the output on failure. */
function run(cmd: string, args: string[], cwd: string): string {
	console.log(`  $ ${cmd} ${args.join(' ')}`);
	try {
		return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: 'pipe' });
	} catch (error) {
		const e = error as { stdout?: string; stderr?: string };
		throw new Error(`${cmd} failed in ${cwd}:\n${e.stdout ?? ''}${e.stderr ?? ''}`, {
			cause: error
		});
	}
}

/** Runs a command that is EXPECTED to fail, and returns its combined output. */
function runExpectingFailure(cmd: string, args: string[], cwd: string): string {
	try {
		execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: 'pipe' });
	} catch (error) {
		const e = error as { stdout?: string; stderr?: string };
		return `${e.stdout ?? ''}${e.stderr ?? ''}`;
	}
	throw new Error(`expected \`${cmd} ${args.join(' ')}\` to fail, and it did not`);
}

const failures: string[] = [];
const check = (label: string, ok: boolean): void => {
	console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}`);
	if (!ok) failures.push(label);
};

// ---------------------------------------------------------------------------
// 1. Build and pack.
// ---------------------------------------------------------------------------
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(packDir, { recursive: true });

console.log('building…');
run('bun', ['run', 'build:packages'], repoRoot);

console.log('packing…');
const tarballs: Record<string, string> = {};
for (const pkg of PACKAGES) {
	const dir = path.join(repoRoot, 'packages', pkg);
	// npm pack prints the filename it wrote; the last line is the name.
	const printed = run('npm', ['pack', '--pack-destination', packDir], dir);
	const file = printed.trim().split('\n').at(-1)!.trim();
	tarballs[pkg] = path.join(packDir, file);

	/*
		A `workspace:` range left in the manifest fails at install time with a
		message that names neither your package nor where the protocol came
		from. `npm pack` does not reliably rewrite it, so check here.
	*/
	const manifest = JSON.parse(
		// A bare filename from packDir: GNU tar (Git Bash) reads `C:\…` as host:path.
		execFileSync('tar', ['-xzOf', file, 'package/package.json'], {
			cwd: packDir,
			encoding: 'utf8'
		})
	) as Record<string, Record<string, string> | undefined>;
	for (const field of ['dependencies', 'peerDependencies']) {
		const entries = Object.entries(manifest[field] ?? {});
		const bad = entries.filter(([, v]) => String(v).startsWith('workspace:'));
		check(`${pkg}: no workspace: ranges in ${field}`, bad.length === 0);
	}
}

// ---------------------------------------------------------------------------
// 2. Scratch consumer, outside the repository.
// ---------------------------------------------------------------------------
console.log('\ncreating the scratch consumer…');
fs.mkdirSync(app, { recursive: true });
fs.writeFileSync(
	path.join(app, 'package.json'),
	JSON.stringify({ name: 'rehearsal', private: true, type: 'module' }, null, '\t')
);
/*
	npm, not bun, and all four in one call.

	Bun resolves peerDependencies against the registry even when a matching
	version is already installed from a tarball — and a packed tarball has no
	registry identity, so the install 404s on a package that is already there.
	npm resolves the same tarballs correctly.
*/
/*
	--no-audit --no-fund: audit contacts the registry for every package in the
	tree, and this one is thrown away in a minute either way.
*/
run('npm', ['install', '--no-audit', '--no-fund', 'tailwindcss', '@tailwindcss/cli'], app);
run('npm', ['install', '--no-audit', '--no-fund', ...PACKAGES.map((p) => tarballs[p])], app);

const cliEntry = path.join(
	path.dirname(
		execFileSync('node', ['-e', "console.log(require.resolve('@tailwindcss/cli/package.json'))"], {
			cwd: app,
			encoding: 'utf8'
		}).trim()
	),
	'dist/index.mjs'
);

/** Writes a stylesheet, compiles it, and returns the output. */
function compile(name: string, css: string): string {
	const inFile = path.join(app, `${name}.css`);
	const outFile = path.join(app, `${name}.out.css`);
	fs.writeFileSync(inFile, css);
	run('node', [cliEntry, '-i', inFile, '-o', outFile], app);
	return fs.readFileSync(outFile, 'utf8');
}

/*
	Probe with the names the PACKED build says it owns, not a hardcoded list:
	a hardcoded name goes stale the moment a component is added or renamed,
	and then fails in a way that looks like a packaging bug.
*/
const generated = path.join(app, 'node_modules/@anti049/lunar-ui/dist/generated');
const load = async <T>(file: string): Promise<T> =>
	((await import(pathToFileURL(path.join(generated, file)).href)) as { default: T }).default;
const registry = await load<{ classes: string[] }>('registry.js');
const functionalUtilities =
	await load<{ name: string; spacing: boolean; arbitrary: boolean }[]>('functional.js');
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const emits = (css: string, cls: string) => new RegExp(`\\.${escapeRe(cls)}(?![-\\w])`).test(css);

// ---------------------------------------------------------------------------
// 3. Standalone: the plugin must carry its own tokens.
// ---------------------------------------------------------------------------
console.log('\nstandalone');
const solo = compile(
	'solo',
	[
		"@import 'tailwindcss' source(none);",
		"@plugin '@anti049/lunar-ui';",
		...registry.classes.map((c) => `@source inline('${c}');`)
	].join('\n')
);
const missing = registry.classes.filter((c) => !emits(solo, c));
check(
	`every registered class emits with no CSS import (${missing.slice(0, 5).join(', ') || `${registry.classes.length} classes`})`,
	registry.classes.length > 0 && missing.length === 0
);

const declared = new Set([...solo.matchAll(/(--[-\w]+)\s*:/g)].map((m) => m[1]));
const dangling = [
	...new Set(
		[...solo.matchAll(/var\(\s*(--[-\w]+)\s*\)/g)]
			.map((m) => m[1])
			.filter((n) => !declared.has(n) && !n.startsWith('--tw-'))
	)
];
check(`no dangling var() (${dangling.slice(0, 5).join(', ') || 'none'})`, dangling.length === 0);

// ---------------------------------------------------------------------------
// 4. The option surface.
// ---------------------------------------------------------------------------
console.log('\noptions');
const prefixed = compile(
	'options',
	[
		"@import 'tailwindcss' source(none);",
		"@plugin '@anti049/lunar-ui' { prefix: px-; --radius-field: 0.75rem; }",
		`@source inline('px-${registry.classes[0]}');`
	].join('\n')
);
check('prefix renames owned classes', emits(prefixed, `px-${registry.classes[0]}`));
check('prefix leaves Tailwind namespaces alone', !prefixed.includes('--px-color-'));
check('shape override reaches :root', /--radius-field:\s*0\.75rem/.test(prefixed));

fs.writeFileSync(
	path.join(app, 'bad.css'),
	"@import 'tailwindcss' source(none);\n@plugin '@anti049/lunar-ui' { --radius-feild: 0; }"
);
const badTokenOutput = runExpectingFailure(
	'node',
	[cliEntry, '-i', path.join(app, 'bad.css'), '-o', path.join(app, 'bad.out.css')],
	app
);
check('a misspelled token is rejected by name', badTokenOutput.includes('radius-feild'));

// ---------------------------------------------------------------------------
// 5. Themes.
// ---------------------------------------------------------------------------
console.log('\nthemes');
const themed = compile(
	'themes',
	[
		"@import 'tailwindcss' source(none);",
		"@plugin '@anti049/lunar-ui';",
		"@plugin '@anti049/lunar-ui/theme' {",
		'\tname: brand;',
		'\tseed-primary: #0956aa;',
		'\tdefault: true;',
		'\t--theme-color-primary-40: #ff00ff;',
		'}'
	].join('\n')
);
// Distinct names: the scale is emitted once per selector the theme lands on
// (`[data-theme='brand']` and, as the default, `:root:not([data-theme])`).
check(
	'a seed generates a full tone scale',
	new Set(themed.match(/--theme-color-primary-\d+(?=:)/g)).size === 30
);
check(
	'hand-declared roles beat generated ones',
	/--theme-color-primary-40:\s*#ff00ff/.test(themed)
);
check('the default never emits at bare :root', /:root:not\(\[data-theme\]\)/.test(themed));

// ---------------------------------------------------------------------------
// 6. Functional utilities.
// ---------------------------------------------------------------------------
console.log('\nfunctional utilities');
const spacingUtility = functionalUtilities.find((u) => u.spacing);
const arbitraryUtility = functionalUtilities.find((u) => u.arbitrary);
if (!spacingUtility && !arbitraryUtility) {
	console.log('  skip no functional utilities in this build');
} else {
	const functional = compile(
		'functional',
		[
			"@import 'tailwindcss' source(none);",
			"@plugin '@anti049/lunar-ui';",
			spacingUtility && `@source inline('${spacingUtility.name}-2');`,
			arbitraryUtility && `@source inline('${arbitraryUtility.name}-[var(--x)]');`
		]
			.filter(Boolean)
			.join('\n')
	);
	if (spacingUtility)
		check(
			`a spacing step keeps the var(--spacing) link (${spacingUtility.name}-2)`,
			functional.includes('calc(var(--spacing) * 2)')
		);
	if (arbitraryUtility)
		check(
			`an arbitrary var() is accepted (${arbitraryUtility.name}-[var(--x)])`,
			functional.includes('var(--x)')
		);
}

// ---------------------------------------------------------------------------
// 7. The JavaScript surface, under plain node.
// ---------------------------------------------------------------------------
console.log('\njavascript');
const esm = (specifier: string): string =>
	run(
		'node',
		[
			'--input-type=module',
			'-e',
			`import(${JSON.stringify(specifier)}).then(m => console.log(Object.keys(m).join(',')))`
		],
		app
	).trim();

// `LunarUI` is the Vue binding's `app.use()` plugin object, not a component.
const names = (keys: string) =>
	keys
		.split(',')
		.filter((k) => /^[A-Z]/.test(k) && k !== 'LunarUI')
		.sort()
		.join(',');

// Plain Node cannot load the Svelte binding — its barrel re-exports .svelte
// files, which only a bundler compiles — so read the names from the barrel.
const svelteBarrel = fs.readFileSync(
	path.join(app, 'node_modules/@anti049/lunar-ui-svelte/dist/index.js'),
	'utf8'
);
// Anchored to the export statement: the barrel's comments mention `default as X`.
const svelte = [...svelteBarrel.matchAll(/^export\s*\{\s*default as (\w+)\s*\}/gm)]
	.map((m) => m[1])
	.sort()
	.join(',');
const react = names(esm('@anti049/lunar-ui-react'));
const vue = names(esm('@anti049/lunar-ui-vue'));
check(`bindings export the same components (${svelte})`, svelte === react && react === vue);

check(
	'the React CJS build resolves',
	run(
		'node',
		['-e', "console.log(Object.keys(require('@anti049/lunar-ui-react')).length)"],
		app
	).trim() !== '0'
);

/*
	Under `node`, not `bun`. The /themes entry must be dependency-free, and Bun
	is forgiving about malformed ESM in dependencies — it would hide exactly the
	failure this checks for.
*/
check(
	'the theme catalogue imports with no runtime dependencies',
	esm('@anti049/lunar-ui/themes').includes('THEME_NAMES')
);

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------
console.log('');
if (failures.length) {
	console.log(`REHEARSAL FAILED: ${failures.length} problem(s)`);
	for (const f of failures) console.log(`  - ${f}`);
	console.log(`\nScratch project left at ${app} for inspection.`);
	process.exitCode = 1;
} else {
	console.log('REHEARSAL PASSED — the packed tarballs behave as published packages.');
	fs.rmSync(scratch, { recursive: true, force: true });
}
