<script lang="ts">
	import FrameworkLinks from '#lib/components/FrameworkLinks.svelte';
	import NavLink from '#lib/components/NavLink.svelte';
	import { resolve } from '$app/paths';
	import navigation from '#lib/state/navigation.svelte.ts';
	import type { LayoutProps } from './$types';
	import { House } from '@lucide/svelte';

	let { children }: LayoutProps = $props();

	// Hands this section's links to the root layout's mobile drawer.
	$effect(() => {
		navigation.section = links;
		return () => {
			if (navigation.section === links) navigation.section = null;
		};
	});
</script>

{#snippet links()}
	<FrameworkLinks>
		<NavLink
			label="Popover"
			href={resolve('/components/(agnostic)/appbar')}
			icon={House}
			status="planned"
		/>
		<NavLink label="Select" href={resolve('/components/(agnostic)/button')} icon={House} />
	</FrameworkLinks>
{/snippet}

<div class="scaffold">
	<!-- Docked from `medium:` up. Below it, the root layout's drawer shows `links`. -->
	<div
		class="sidebar gap-2 rounded-e-none border-r border-r-surface-container surface p-2 max-medium:hidden"
	>
		{@render links()}
	</div>
	<div class="scaffold-body p-4">
		{@render children()}
	</div>
</div>
