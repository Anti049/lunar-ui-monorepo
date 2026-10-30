<!-- The Components section's links: its sidebar, and its page in the mobile drawer. -->
<script lang="ts">
	import FrameworkLinks from '#lib/components/FrameworkLinks.svelte';
	import NavLink from '#lib/components/NavLink.svelte';
	import { componentCategories } from '#lib/utils/navigation.ts';
</script>

<FrameworkLinks>
	<div class="flex flex-col gap-4">
		{#each componentCategories as { id, label, icon, links } (id)}
			{@const Icon = icon}
			<div class="flex flex-col gap-2">
				<span
					class="button disabled flex flex-row gap-3 button-text px-2 text-title-small text-on-surface-variant"
				>
					<Icon />
					<span>{label}</span>
				</span>
				<div class="h-0.5 w-full rounded-full surface-container"></div>
				{#each links as link (link.href)}
					<NavLink {...link} />
				{/each}
			</div>
		{/each}
	</div>
</FrameworkLinks>
