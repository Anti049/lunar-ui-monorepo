<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '../utils/cn.js';

	export type Variant = 'filled' | 'tonal' | 'outlined' | 'text';
	export type Size = 'sm' | 'md' | 'lg';

	/*
		`class` is a reserved word, so it cannot be destructured under its own
		name. Rename it to `className` and re-expose it — forgetting this is why
		a consumer's `class` silently does nothing.

		`...rest` collects every remaining button attribute (type, disabled,
		aria-*, onclick) so the component does not have to enumerate them.
	*/
	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		class?: string;
	}

	let { variant = 'filled', size = 'md', class: className, children, ...rest }: Props = $props();
</script>

<button class={cn('button', `button-${variant}`, `button-${size}`, className)} {...rest}>
	{@render children?.()}
</button>
