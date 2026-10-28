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
	<title>{title} — test</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<article class="prose mx-auto max-w-3xl p-8">
	<h1>{title}</h1>
	{#if description}<p class="lead">{description}</p>{/if}
	{@render children()}
</article>
