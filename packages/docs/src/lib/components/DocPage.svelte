<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		svelte?: ResolvedPathname;
		react?: ResolvedPathname;
		vue?: ResolvedPathname;
		children?: Snippet;
	}

	let { title, description = '', svelte, react, vue, children }: Props = $props();
</script>

<svelte:head>
	<title>LunarUI • {title}</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<!--
	At least as tall as the scaffold body, never capped, so a page's content can
	take the leftover height with `flex-1` and a long page still scrolls.
-->
<div class="flex min-h-full w-full flex-col gap-4">
	<div class="flex flex-col gap-2">
		<h1
			class="text-headline-medium-emphasized text-primary medium:text-display-small-emphasized expanded:text-display-medium-emphasized"
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
		<hr class="nav-divider" />
	</div>
	{@render children?.()}
</div>
