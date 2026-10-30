<!--
	The framework switcher at the top of every Components sidebar: the plain CSS
	components, then each framework's, then a divider, then the page's own
	component links as `children`.

	The switcher stays put and only the component list scrolls. `min-h-0` lets
	the list shrink below its content inside the sidebar's or drawer's flex
	column, which is what makes it scroll rather than the whole panel. The
	negative margins take it out to the panel's edges, so the scrollbar sits
	against the edge and focus outlines are not clipped. The bar takes the place
	of end padding (`pe-[…--scrollbar-size…]`), so the component links stay as
	wide as the framework links above them.
-->
<script lang="ts">
	import NavLink from '#lib/components/NavLink.svelte';
	import { resolve } from '$app/paths';
	import { Component } from '@lucide/svelte';
	import SvelteIcon from '@iconify-svelte/fa7-brands/svelte';
	import ReactIcon from '@iconify-svelte/fa7-brands/react';
	import VuejsIcon from '@iconify-svelte/fa7-brands/vuejs';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<NavLink
	label="LunarUI"
	href={resolve('/components')}
	dontInclude={[
		resolve('/components/svelte'),
		resolve('/components/react'),
		resolve('/components/vue')
	]}
	icon={Component}
/>
<NavLink label="Svelte" href={resolve('/components/svelte')} icon={SvelteIcon} />
<NavLink label="React" href={resolve('/components/react')} icon={ReactIcon} />
<NavLink label="Vue" href={resolve('/components/vue')} icon={VuejsIcon} />
<div class="h-0.5 w-full rounded-full surface-container"></div>
<div
	class="-mx-2 -mb-2 flex scrollbar min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain ps-2 pe-[max(0px,calc(0.5rem-var(--scrollbar-size)))] pb-2 scrollbar-fade scrollbar-sm max-compact:scrollbar-disabled"
>
	{@render children()}
</div>
