import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const pluginEntry = fileURLToPath(new URL('../core/index.ts', import.meta.url));
const svelteLib = fileURLToPath(new URL('../svelte/src/lib/index.ts', import.meta.url));
const watcher = fileURLToPath(new URL('../core/functions/watch.ts', import.meta.url));
const appCss = fileURLToPath(new URL('./src/app.css', import.meta.url));

/*
	The version of the plugin the docs are installed against, shown in the
	header. Read from node_modules rather than imported, because the package's
	`exports` map does not expose `./package.json`. Read once at startup, so a
	version bump needs a dev-server restart to show.
*/
const pluginManifest = fileURLToPath(
	new URL('./node_modules/@anti049/lunar-ui/package.json', import.meta.url)
);
const pluginVersion: string = JSON.parse(fs.readFileSync(pluginManifest, 'utf8')).version;

/*
	SvelteKit's options — what SvelteKit 2 read from svelte.config.js. `satisfies`
	keeps literals like 'fail' typed as literals rather than widening them to string.
*/
const kit = {
	compilerOptions: {
		// Written by the scaffold: runes mode for this project's own components,
		// the dependency's choice for anything in node_modules. Can go in Svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},

	adapter: adapter({
		// `upload-pages-artifact` in guide 9 reads `build/`. These must agree.
		pages: 'build',
		assets: 'build',
		/*
			Pages has no server, so an unknown URL cannot be routed server-side.
			Writing index.html as the 404 page makes it serve the app, which then
			routes client-side.
		*/
		fallback: '404.html',
		precompress: false,
		/*
			Fail the build if any route could not be prerendered. For a docs
			site that is what you want: every page is static, and a route that
			needs a server is a mistake rather than something to fall back on.
		*/
		strict: true
	}),

	paths: {
		/*
			Pages serves from https://<user>.github.io/<repo>/, so every asset
			and link needs that prefix. Read at BUILD time from the environment
			— guide 9's workflow sets it — and empty locally, so `vite dev`
			serves from the root. The cast is because env vars are plain strings;
			SvelteKit itself throws at startup if the value lacks a leading slash.
		*/
		base: (process.env.BASE_PATH ?? '') as '' | `/${string}`
	},

	prerender: {
		// A broken internal link fails the build rather than shipping. This is
		// what catches a hand-written href that ignores the base path.
		handleHttpError: 'fail'
	}
} satisfies Parameters<typeof sveltekit>[0];

/**
 * Rebuilds the plugin when its CSS changes, and makes Tailwind notice.
 *
 * Two halves, because neither is enough alone: the watcher regenerates
 * `generated/`, and the mtime bump below is what re-runs Tailwind's CSS
 * transform. Tailwind's own hot-update hook deliberately ignores .ts and .js,
 * so a change to the plugin entry never reaches it otherwise.
 */
function livePlugin(entry: string): Plugin {
	return {
		name: 'lunar-ui:reload',
		// Keeps all of this out of production builds. Without it, `vite build`
		// spawns a watcher that never exits and CI hangs at 100% with no error.
		apply: 'serve',
		configureServer(server) {
			/*
				A child process, not a sibling workspace script: `bun run --filter`
				orders by workspace dependency, and docs depends on core, so a
				never-exiting watcher there stops the dev server from ever starting.
			*/
			const child = spawn('bun', [watcher], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: process.platform === 'win32'
			});
			const stop = () => child.kill();
			// Both handlers are needed: `close` covers a restart, `exit` covers
			// Ctrl-C. Miss either and the watcher outlives the dev server.
			server.httpServer?.on('close', stop);
			process.on('exit', stop);

			server.watcher.add(entry);
			server.watcher.on('change', (file) => {
				if (path.resolve(file) !== path.resolve(entry)) return;
				/*
					Bumping app.css's mtime is what re-runs Tailwind's transform.
					Invalidating the module by hand still serves a cached `?direct`
					response; a synthetic watcher event runs HMR but not a fresh
					transform. Only a real mtime change does both.
				*/
				const now = new Date();
				fs.utimesSync(appCss, now, now);
			});
		}
	};
}

export default defineConfig(({ command }) => ({
	// tailwindcss() BEFORE sveltekit(), or the CSS transform runs after
	// SvelteKit has handled the file and your utilities are missing.
	plugins: [
		tailwindcss(),
		sveltekit(kit),
		...(command === 'serve' ? [livePlugin(pluginEntry)] : [])
	],

	// Replaced in source at build time. Declared for TypeScript in app.d.ts.
	define: {
		__LUNAR_UI_VERSION__: JSON.stringify(pluginVersion)
	},

	resolve: {
		/*
			Array form with ANCHORED patterns. The object form matches by prefix,
			so a bare '@anti049/lunar-ui' would also catch '@anti049/lunar-ui/theme' and
			rewrite it to `index.ts/theme`, breaking every subpath export.

			One entry per exported subpath. Guide 15 adds `./theme` and `./themes`
			to the plugin, and each needs a line here.
		*/
		alias: [
			{ find: /^@anti049\/lunar-ui-svelte$/, replacement: svelteLib },
			// Serve only: production builds resolve to dist/, so the site is built
			// against what consumers actually install.
			...(command === 'serve' ? [{ find: /^@anti049\/lunar-ui$/, replacement: pluginEntry }] : [])
		]
	},

	ssr: {
		/*
			Dependencies with extensionless internal imports fail under Node's ESM
			resolver, which is what Vite SSR runs on. Listing one here makes Vite
			bundle it instead of handing it to Node.

			Empty until guide 15, which adds `@material/material-color-utilities`.
		*/
		noExternal: []
	},

	// Vite refuses to serve files outside the project root, and every alias
	// above points outside it.
	server: { fs: { allow: [repoRoot] } }
}));
