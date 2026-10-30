<script lang="ts">
	import { cn } from '@anti049/lunar-ui-svelte';
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import {
		isDisabled,
		routeStatuses,
		type Icon,
		type NavigationRouteStatus
	} from '#lib/utils/navigation.ts';
	import { kebabCase } from 'change-case';

	interface NavLinkProps {
		label: string;
		href: ResolvedPathname;
		/** Path prefix that marks the link active, base path included. Defaults to `href`. */
		match?: string;
		dontInclude?: ResolvedPathname[];
		icon?: Icon;
		status?: NavigationRouteStatus;
	}

	let { label, href, match = href, dontInclude = [], icon, status }: NavLinkProps = $props();

	let isActive = $derived(
		page.url.pathname.startsWith(match) &&
			!dontInclude.some((badHref) => page.url.pathname.startsWith(badHref))
	);
</script>

<div
	class={cn('tooltip tooltip-right tooltip-center tooltip-surface tooltip-gap-4')}
	data-tooltip={label}
>
	<div class="tooltip-content flex flex-row items-center gap-2">
		<span class="sidebar-label">{label}</span>
		{#if status}
			{@const navStatus = routeStatuses[status]}
			<div class={cn('badge ml-auto badge-tonal', navStatus.badge)}>
				<span class="text-caption-medium">{navStatus.label}</span>
			</div>
		{/if}
	</div>
	<a
		{href}
		class={cn(
			'interactive sidebar-item flex flex-row items-center px-2',
			isDisabled(href) && 'disabled',
			isActive ? 'primary-container' : 'surface-container'
		)}
	>
		{#if icon}
			{@const Icon = icon}
			{#if typeof Icon === 'string'}
				<img src={Icon} alt={`${kebabCase(label)}-icon`} class="nav-link-icon" />
			{:else}
				<Icon />
			{/if}
		{/if}
		<span class="sidebar-label">{label}</span>
		{#if status}
			{@const navStatus = routeStatuses[status]}
			<div class={cn('badge ml-auto badge-tonal', navStatus.badge)}>
				<navStatus.icon class="aspect-square h-full" />
			</div>
		{/if}
	</a>
</div>
