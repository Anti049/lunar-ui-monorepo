<script lang="ts">
	import DocPage from '#lib/components/DocPage.svelte';
	import { cn } from '@anti049/lunar-ui-svelte';
	import { capitalCase } from 'change-case';

	const typography = [
		['display', 'large', 'text-display-large', 'text-display-large-emphasized'],
		['display', 'medium', 'text-display-medium', 'text-display-medium-emphasized'],
		['display', 'small', 'text-display-small', 'text-display-small-emphasized'],
		['headline', 'large', 'text-headline-large', 'text-headline-large-emphasized'],
		['headline', 'medium', 'text-headline-medium', 'text-headline-medium-emphasized'],
		['headline', 'small', 'text-headline-small', 'text-headline-small-emphasized'],
		['title', 'large', 'text-title-large', 'text-title-large-emphasized'],
		['title', 'medium', 'text-title-medium', 'text-title-medium-emphasized'],
		['title', 'small', 'text-title-small', 'text-title-small-emphasized'],
		['label', 'large', 'text-label-large', 'text-label-large-emphasized'],
		['label', 'medium', 'text-label-medium', 'text-label-medium-emphasized'],
		['label', 'small', 'text-label-small', 'text-label-small-emphasized'],
		['body', 'large', 'text-body-large', 'text-body-large-emphasized'],
		['body', 'medium', 'text-body-medium', 'text-body-medium-emphasized'],
		['body', 'small', 'text-body-small', 'text-body-small-emphasized'],
		['caption', 'large', 'text-caption-large', 'text-caption-large-emphasized'],
		['caption', 'medium', 'text-caption-medium', 'text-caption-medium-emphasized'],
		['caption', 'small', 'text-caption-small', 'text-caption-small-emphasized']
	] as const;
</script>

<DocPage title="Typography" description="How to use typography in LunarUI">
	<!--
		One column: all standard styles, a divider, then all emphasized ones, in source order.
		From `compact:` up, the grid fills column by column instead, and 19 rows
		(a heading plus 18 styles) put each style beside its emphasized variant.
		The rows are `auto`, not grid-rows-19's 1fr, so each fits its own text.
	-->
	<div
		class="mx-auto grid max-w-[1600px] grid-cols-1 gap-2 text-center compact:grid-flow-col compact:grid-cols-2 compact:grid-rows-[repeat(19,auto)] medium:px-2 expanded:px-4"
	>
		{#each [['Standard', 2], ['Emphasized', 3]] as const as [heading, column], index (heading)}
			{#if index > 0}
				<!-- Single column only. Hidden, it takes no grid cell, so the 19 rows still line up. -->
				<div class="my-2 h-0.5 w-full rounded-full surface-container compact:hidden"></div>
			{/if}
			<span class="flex h-full items-center justify-center rounded-sm p-2 text-title-large"
				>{heading}</span
			>
			{#each typography as row (row[2])}
				<span
					class={cn(
						'flex h-full items-center justify-center rounded-sm surface-container-low px-4 py-2',
						row[column]
					)}>{capitalCase(row[0])} {capitalCase(row[1])}</span
				>
			{/each}
		{/each}
	</div>
</DocPage>
