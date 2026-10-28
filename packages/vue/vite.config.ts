import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command }) => ({
	plugins: [vue(), tailwindcss()],

	// Playground while serving.
	root: command === 'serve' ? 'src/demo' : undefined,

	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
			formats: ['es'],
			fileName: 'index'
		},
		rollupOptions: {
			// Never bundle the consumer's Vue, or you ship a second runtime and
			// component instances stop sharing reactivity.
			external: ['vue', '@anti049/lunar-ui'],
			output: {
				// Keep styles.css at a predictable name for the exports map.
				assetFileNames: 'styles.css'
			}
		}
	}
}));
