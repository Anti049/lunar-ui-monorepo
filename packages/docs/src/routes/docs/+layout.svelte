<script lang="ts">
	import type { LayoutProps } from './$types';
	import DocsLinks from '#lib/components/DocsLinks.svelte';
	import navigation from '#lib/state/navigation.svelte.ts';

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
	<DocsLinks />
{/snippet}

<div class="scaffold">
	<!-- Docked from `medium:` up. Below it, the root layout's drawer shows `links`. -->
	<div
		class="gap-2 rounded-e-none border-r border-r-surface-container surface p-2 max-medium:hidden medium:sidebar"
	>
		{@render links()}
	</div>
	<div class="scaffold-body p-4 medium:p-6 expanded:p-8">
		{@render children()}
	</div>
</div>
