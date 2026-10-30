<script lang="ts">
	// The only place the stylesheet is imported. Everything below inherits it.
	import '../app.css';
	import { onMount } from 'svelte';
	import { userPrefersMode as mode, ModeWatcher, setMode } from 'mode-watcher';
	import {
		cn,
		disableRipple,
		disableScrollbarFade,
		enableRipple,
		enableScrollbarFade
	} from '@anti049/lunar-ui-svelte';
	// Imported, not referenced by URL, so Vite fingerprints it and the base
	// path is applied for you. The scaffold put it here.
	import type { LayoutProps } from './$types';
	import {
		BookOpen,
		ChevronLeft,
		ChevronRight,
		Component,
		Menu,
		Moon,
		Palette,
		PanelsTopLeft,
		Sun,
		SunMoon
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import NavLink from '#lib/components/NavLink.svelte';
	import DocsLinks from '#lib/components/DocsLinks.svelte';
	import ComponentsLinks from '#lib/components/ComponentsLinks.svelte';
	import navigation from '#lib/state/navigation.svelte.ts';
	import favicon from '#lib/assets/favicon.svg';

	let { children }: LayoutProps = $props();

	// Matches --breakpoint-medium, where section sidebars dock and the drawer is not needed.
	const docked = new MediaQuery('min-width: 960px');

	/*
		The drawer's top level. A section with `links` opens them in the drawer
		instead of navigating; the rest are ordinary links.
	*/
	const sections = [
		{
			label: 'Docs',
			href: resolve('/docs/intro'),
			// /docs has no page of its own, so the prefix is built from the root,
			// which carries the base path.
			match: `${resolve('/')}docs`,
			icon: BookOpen,
			links: DocsLinks
		},
		{ label: 'Components', href: resolve('/components'), icon: Component, links: ComponentsLinks },
		{ label: 'Templates', href: resolve('/templates'), icon: PanelsTopLeft },
		{ label: 'Theme Generator', href: resolve('/theme-generator'), icon: Palette }
	];

	function openNavigation() {
		// Always open on the current section's links, not wherever Back left it.
		navigation.view = 'section';
		navigation.browsing = null;
		navigation.open = true;
	}

	function browse(links: typeof DocsLinks, match: string) {
		/*
			The section the reader is already in shows the links its own layout
			registered, which can differ from the section's defaults: the
			Svelte, React and Vue pages list their own components.
		*/
		const current = navigation.section && page.url.pathname.startsWith(match);
		navigation.browsing = current ? null : links;
		navigation.view = 'section';
	}

	afterNavigate(() => (navigation.open = false));
	$effect(() => {
		if (docked.current) navigation.open = false;
	});

	function cycleMode() {
		if (mode.current === 'light') {
			setMode('dark');
		} else if (mode.current === 'dark') {
			setMode('system');
		} else {
			setMode('light');
		}
	}

	function isActive(href: string) {
		return page.url.pathname.startsWith(href);
	}

	// On for the whole site; the Ripple and Scrollbar pages can switch them off.
	onMount(() => {
		enableRipple();
		enableScrollbarFade();
		return () => {
			disableRipple();
			disableScrollbarFade();
		};
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') navigation.open = false;
	}}
/>
<ModeWatcher defaultTheme="default" darkClassNames={['dark']} lightClassNames={['light']} />
<div class="scaffold h-screen">
	<div class="appbar scaffold-appbar appbar-centered border-b border-b-surface-container">
		<div
			class="appbar-leading flex h-full flex-row items-center justify-center medium:w-60 medium:min-w-60"
		>
			<a
				href={resolve('/')}
				class="group hidden h-full w-fit flex-row items-center justify-evenly gap-4 rounded-sm px-2 medium:flex"
			>
				<img
					src={favicon}
					alt="Logo"
					class="group-hover:aura aspect-square h-full transition-[scale] group-hover:scale-110"
				/>
				<div class="flex flex-col">
					<span class="text-title-medium-emphasized">LunarUI</span>
					<span class="-mt-1 text-right text-caption-small text-on-surface-variant"
						>v{__LUNAR_UI_VERSION__}</span
					>
				</div>
			</a>
			<button
				class="button button-square button-md button-text text-on-surface button-surface medium:hidden"
				aria-label="Open navigation"
				onclick={openNavigation}
			>
				<Menu />
			</button>
		</div>
		<div class="appbar-body">
			<img src={favicon} alt="Logo" class="aspect-square h-full medium:hidden" />
			<div
				class="flex h-full w-full flex-row items-center justify-center gap-2 self-center max-medium:hidden"
			>
				<div
					class="tooltip tooltip-bottom h-full tooltip-center tooltip-gap-4 expanded:tooltip-disabled"
					data-tooltip="Docs"
				>
					<a
						href={resolve('/docs/intro')}
						class={cn(
							'button flex button-md h-full flex-row gap-2 button-tonal',
							isActive('/docs') ? 'button-primary' : 'button-surface'
						)}
					>
						<BookOpen />
						<span class="hidden expanded:flex">Docs</span>
					</a>
				</div>
				<div
					class="tooltip tooltip-bottom h-full tooltip-center tooltip-gap-4 expanded:tooltip-disabled"
					data-tooltip="Components"
				>
					<a
						href={resolve('/components')}
						class={cn(
							'button flex button-md h-full flex-row gap-2 button-tonal',
							isActive('/components') ? 'button-primary' : 'button-surface'
						)}
					>
						<Component />
						<span class="hidden expanded:flex">Components</span>
					</a>
				</div>
				<div
					class="tooltip tooltip-bottom h-full tooltip-center tooltip-gap-4 expanded:tooltip-disabled"
					data-tooltip="Templates"
				>
					<a
						href={resolve('/templates')}
						class={cn(
							'button flex button-md h-full flex-row gap-2 button-tonal',
							isActive('/templates') ? 'button-primary' : 'button-surface'
						)}
					>
						<PanelsTopLeft />
						<span class="hidden expanded:flex">Templates</span>
					</a>
				</div>
				<div
					class="tooltip tooltip-bottom h-full tooltip-center tooltip-gap-4 expanded:tooltip-disabled"
					data-tooltip="Theme Generator"
				>
					<a
						href={resolve('/theme-generator')}
						class={cn(
							'button flex button-md h-full flex-row gap-2 button-tonal',
							isActive('/theme-generator') ? 'button-primary' : 'button-surface'
						)}
					>
						<Palette />
						<span class="hidden expanded:flex">Theme Generator</span>
					</a>
				</div>
			</div>
		</div>
		<div class="appbar-trailing flex flex-row-reverse medium:w-60 medium:min-w-60">
			<button class="button button-square button-md button-text button-surface" onclick={cycleMode}>
				{#if mode.current === 'light'}
					<Sun />
				{:else if mode.current === 'dark'}
					<Moon />
				{:else}
					<SunMoon />
				{/if}
			</button>
			<select class="select select-tonal select-surface max-medium:hidden">
				<option value="dracula">Dracula</option>
			</select>
		</div>
	</div>
	<button
		class="drawer-scrim"
		aria-label="Close navigation"
		onclick={() => (navigation.open = false)}
	></button>
	<nav class="drawer gap-2 p-2" aria-label="Navigation" data-open={navigation.open ? true : null}>
		{#if navigation.view === 'section' && (navigation.browsing || navigation.section)}
			<button
				class="interactive sidebar-item surface-container"
				onclick={() => (navigation.view = 'main')}
			>
				<ChevronLeft />
				<span class="sidebar-label">Back</span>
			</button>
			<div class="h-0.5 w-full rounded-full surface-container"></div>
			{#if navigation.browsing}
				<navigation.browsing />
			{:else}
				{@render navigation.section?.()}
			{/if}
		{:else}
			{#each sections as { label, href, match = href, icon: Icon, links } (label)}
				{#if links}
					<button
						class={cn(
							'interactive sidebar-item',
							isActive(match) ? 'primary-container' : 'surface-container'
						)}
						onclick={() => browse(links, match)}
					>
						<Icon />
						<span class="sidebar-label grow text-left">{label}</span>
						<ChevronRight />
					</button>
				{:else}
					<NavLink {label} {href} {match} icon={Icon} />
				{/if}
			{/each}
		{/if}
	</nav>
	<div class="scaffold-body mx-auto w-full">
		{@render children()}
	</div>
</div>
