/*
	Imported for its side effect only: it carries the `@source` registration
	that tells a consumer's Tailwind where this package's components live.
	`sideEffects` in package.json lists CSS so a bundler cannot drop it.
*/
import './styles.css';

// Components. `default as X` because a .svelte file's component is its default.
export { default as Button } from './components/Button.svelte';

// Behaviour.
export { ripple } from './actions/ripple.js';

// The class-merge helper, exported so consumers composing on top of a component
// resolve conflicts the same way the component does.
export { cn } from './utils/cn.js';

/*
	Types, exported alongside anything a consumer might annotate. `export type`
	rather than `export` is required under isolatedModules, which the base
	tsconfig turns on.

	Svelte 5 exports a component's prop types from the component file itself, so
	these come from the .svelte, not from a separate .d.ts.
*/
export type { Variant as ButtonVariant, Size as ButtonSize } from './components/Button.svelte';
