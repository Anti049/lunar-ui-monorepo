<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	import { Bell, Mail } from '@lucide/svelte';

	const placements = [
		['indicator-top', 'indicator-left'],
		['indicator-top', 'indicator-center'],
		['indicator-top', 'indicator-right'],
		['indicator-middle', 'indicator-left'],
		['indicator-middle', 'indicator-center'],
		['indicator-middle', 'indicator-right'],
		['indicator-bottom', 'indicator-left'],
		['indicator-bottom', 'indicator-center'],
		['indicator-bottom', 'indicator-right']
	] as const;
</script>

<DocPage
	title="Indicator"
	description="Pins a badge or other element to a corner or edge of another element."
>
	<!-- Header/Classes -->
	<ComponentClassTable name="indicator" />
	<!-- Basic -->
	<ComponentPreview
		id="basic"
		title="Indicator"
		description="Wrap the element in .indicator and add an .indicator-item. It sits at the top end corner by default."
	>
		<div class="indicator">
			<button
				class="button button-square button-md button-tonal button-surface"
				aria-label="Notifications"
			>
				<Bell />
			</button>
			<span class="badge indicator-item badge-error">3</span>
		</div>
		<div class="indicator">
			<button class="button button-square button-md button-tonal button-surface" aria-label="Mail">
				<Mail />
			</button>
			<span class="badge indicator-item badge-primary"></span>
		</div>
	</ComponentPreview>
	<!-- Placements -->
	<ComponentPreview
		id="placements"
		title="Placements"
		description="Combine one vertical and one horizontal placement class."
	>
		<div class="indicator">
			{#each placements as [y, x] (y + x)}
				<span class="badge indicator-item badge-primary {y} {x}"></span>
			{/each}
			<div class="grid h-32 w-48 place-items-center rounded-sm surface-container">Content</div>
		</div>
	</ComponentPreview>
	<!-- Alert -->
	<ComponentPreview
		id="alert"
		title="Animated Indicator"
		description="Pair with badge-animate-alert to draw attention."
	>
		<div class="indicator">
			<button
				class="button button-square button-md button-tonal button-surface"
				aria-label="Notifications"
			>
				<Bell />
			</button>
			<span class="badge badge-animate-alert indicator-item badge-error"></span>
		</div>
	</ComponentPreview>
</DocPage>
