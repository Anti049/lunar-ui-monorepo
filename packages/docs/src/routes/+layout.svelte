<script lang="ts">
	// The only place the stylesheet is imported. Everything below inherits it.
	import '../app.css';
	// Imported, not referenced by URL, so Vite fingerprints it and the base
	// path is applied for you. The scaffold put it here.
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
