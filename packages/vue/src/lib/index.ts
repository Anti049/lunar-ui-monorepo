/*
	Imported for its side effect only: it carries the `@source` registration
	that tells a consumer's Tailwind where this package's components live.
	Vite emits it as an asset, which is why `assetFileNames` in vite.config.ts
	pins the name.
*/
import './styles.css';

/*
	Vue SFC imports keep the `.vue` extension — it is part of the specifier, not
	something `moduleResolution: bundler` rewrites. This differs from the React
	package's `.js` extensions and is correct in both.
*/
export { default as Button } from './components/Button.vue';

export { useRipple } from './composables/useRipple';
export { cn } from './utils/cn';

/*
	Optional: a Vue plugin, so a consumer can register everything globally with
	`app.use(LunarUI)` rather than importing per component. Prefix the global
	names — `Button` alone will collide with something in any real app.
*/
import type { App } from 'vue';
import Button from './components/Button.vue';

export const LunarUI = {
	install(app: App) {
		app.component('PButton', Button);
	}
};
