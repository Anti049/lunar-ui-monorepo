<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
</script>

<DocPage title="Scrollbar" description="Themed scrollbars for any scroll container.">
	<!-- Header/Classes -->
	<ComponentClassTable name="scrollbar" />
	<p class="text-body-medium text-on-surface-variant">
		Put <code>.scrollbar</code> on the scroll container itself. Override the look with
		<code>--scrollbar-color</code>, <code>--scrollbar-size</code> and <code>--scrollbar-width</code>
		(Firefox), and the fade timing with <code>--scrollbar-fade-delay</code> and
		<code>--scrollbar-fade-duration</code>.
	</p>
	<!-- Scrollbar Colors -->
	<ComponentPreview id="colors" title="Scrollbar Colors">
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-surface"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-primary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-secondary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-tertiary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-error"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-success"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-warning"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-info"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-alert"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
	</ComponentPreview>
	<!-- Scrollbar Sizes -->
	<ComponentPreview
		id="sizes"
		title="Scrollbar Sizes"
		description="Chromium and Safari honour any size; Firefox maps them to thin or auto."
	>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-sm scrollbar-primary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-md scrollbar-primary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-lg scrollbar-primary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
	</ComponentPreview>
	<!-- Fading Scrollbar -->
	<ComponentPreview
		id="fade"
		title="Fading Scrollbar"
		description="Hidden until hovered or focused. Showing it while scrolling needs initScrollbarFade() from the framework package."
	>
		<div
			class="scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-fade scrollbar-primary"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
	</ComponentPreview>
	<!-- Disabled Scrollbar -->
	<ComponentPreview
		id="disabled"
		title="Disabled Scrollbar"
		description="No bar and no reserved gutter; the element still scrolls."
	>
		<div
			class="scrollbar-disabled scrollbar h-40 w-40 overflow-y-auto rounded-sm surface-container-low p-2"
		>
			{#each { length: 30 }, i (i)}
				<p>Line {i + 1}</p>
			{/each}
		</div>
	</ComponentPreview>
</DocPage>
