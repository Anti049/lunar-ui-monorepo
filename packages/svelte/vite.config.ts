import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		// tailwindcss() must come BEFORE sveltekit(), or the CSS transform runs
		// after SvelteKit has already handled the file and your utilities are
		// missing from the playground with no error.
		tailwindcss(),
		sveltekit({
			// Written by the scaffold: runes mode for this package's own components.
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			/*
				Strips `lang="ts"` from component <script> blocks during
				`svelte-package` — which reads this file — so the published .svelte
				files are consumable by a project that does not use TypeScript.
			*/
			preprocess: vitePreprocess()

			/*
				No adapter. `src/routes/` is a playground served by `vite dev` and
				never built as an app; `files` in package.json lists `dist` alone.
			*/
		})
	]
});
