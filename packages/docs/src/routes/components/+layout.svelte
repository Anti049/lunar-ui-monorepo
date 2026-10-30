<script lang="ts">
	import ComponentsLinks from '#lib/components/ComponentsLinks.svelte';
	import navigation from '#lib/state/navigation.svelte.ts';
	import type { LayoutProps } from './$types';

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
	<ComponentsLinks />
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
