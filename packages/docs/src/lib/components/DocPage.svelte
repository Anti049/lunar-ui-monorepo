<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		children: Snippet;
	}

	let { title, description = '', children }: Props = $props();
</script>

<svelte:head>
	<title>LunarUI • {title}</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<!--
	At least as tall as the scaffold body, never capped, so a page's content can
	take the leftover height with `flex-1` and a long page still scrolls.
-->
<div class="flex min-h-full w-full flex-col gap-8">
	<div class="flex flex-col gap-2">
		<h1
			class="text-display-small-emphasized medium:text-display-medium-emphasized expanded:text-display-large-emphasized"
		>
			{title}
		</h1>
		{#if description}
			<p
				class="text-title-small text-on-surface-variant medium:text-title-medium expanded:text-title-large"
			>
				{description}
			</p>
		{/if}
		<div class="h-0.5 w-full rounded-full surface-container"></div>
	</div>
	{@render children()}
</div>
