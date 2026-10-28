import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/lib/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	// Never bundle these — the consumer brings their own, and two copies of
	// React in one app is the classic "invalid hook call" crash.
	external: ['react', 'react-dom', '@anti049/lunar-ui'],
	outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' })
});
