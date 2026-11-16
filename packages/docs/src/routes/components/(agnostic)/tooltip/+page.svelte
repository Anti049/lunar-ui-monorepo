<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
</script>

<DocPage
	title="Tooltip"
	description="Shows a short label when the user hovers over or focuses an element."
>
	<!-- Header/Classes -->
	<ComponentClassTable name="tooltip" />
	<!-- Tooltip -->
	<ComponentPreview
		id="basic"
		title="Tooltip"
		description="Put the text in data-tooltip on the wrapper. Shows on hover and keyboard focus."
	>
		<div class="tooltip" data-tooltip="Hello!">
			<button class="button button-md button-tonal button-surface">Hover me</button>
		</div>
	</ComponentPreview>
	<!-- Placements -->
	<ComponentPreview id="placements" title="Placements">
		<div class="tooltip tooltip-top" data-tooltip="Top">
			<button class="button button-md button-tonal button-surface">Top</button>
		</div>
		<div class="tooltip tooltip-bottom" data-tooltip="Bottom">
			<button class="button button-md button-tonal button-surface">Bottom</button>
		</div>
		<div class="tooltip tooltip-left" data-tooltip="Left">
			<button class="button button-md button-tonal button-surface">Left</button>
		</div>
		<div class="tooltip tooltip-right" data-tooltip="Right">
			<button class="button button-md button-tonal button-surface">Right</button>
		</div>
	</ComponentPreview>
	<!-- Alignment -->
	<ComponentPreview
		id="alignment"
		title="Alignment"
		description="Aligns the bubble to the start, centre or end of the trigger."
	>
		<div class="tooltip tooltip-bottom tooltip-start" data-tooltip="Aligned to the start">
			<button class="button button-md button-tonal button-surface">Start</button>
		</div>
		<div class="tooltip tooltip-bottom tooltip-center" data-tooltip="Aligned to the center">
			<button class="button button-md button-tonal button-surface">Center</button>
		</div>
		<div class="tooltip tooltip-bottom tooltip-end" data-tooltip="Aligned to the end">
			<button class="button button-md button-tonal button-surface">End</button>
		</div>
	</ComponentPreview>
	<!-- Tooltip Colors -->
	<ComponentPreview id="colors" title="Tooltip Colors">
		<div class="tooltip tooltip-surface" data-tooltip="Surface">
			<button class="button button-md button-tonal button-surface">Surface</button>
		</div>
		<div class="tooltip tooltip-primary" data-tooltip="Primary">
			<button class="button button-md button-tonal button-surface">Primary</button>
		</div>
		<div class="tooltip tooltip-secondary" data-tooltip="Secondary">
			<button class="button button-md button-tonal button-surface">Secondary</button>
		</div>
		<div class="tooltip tooltip-tertiary" data-tooltip="Tertiary">
			<button class="button button-md button-tonal button-surface">Tertiary</button>
		</div>
		<div class="tooltip tooltip-error" data-tooltip="Error">
			<button class="button button-md button-tonal button-surface">Error</button>
		</div>
		<div class="tooltip tooltip-success" data-tooltip="Success">
			<button class="button button-md button-tonal button-surface">Success</button>
		</div>
		<div class="tooltip tooltip-warning" data-tooltip="Warning">
			<button class="button button-md button-tonal button-surface">Warning</button>
		</div>
		<div class="tooltip tooltip-info" data-tooltip="Info">
			<button class="button button-md button-tonal button-surface">Info</button>
		</div>
		<div class="tooltip tooltip-alert" data-tooltip="Alert">
			<button class="button button-md button-tonal button-surface">Alert</button>
		</div>
	</ComponentPreview>
	<!-- Tooltip Content -->
	<ComponentPreview
		id="content"
		title="Tooltip Content"
		description="Use a .tooltip-content child instead of data-tooltip for markup."
	>
		<div class="tooltip tooltip-bottom">
			<div class="tooltip-content flex flex-col items-start gap-1 text-start">
				<span class="text-title-small">Rich tooltip</span>
				<span class="text-body-small">Any markup can go in tooltip-content.</span>
			</div>
			<button class="button button-md button-tonal button-surface">Hover me</button>
		</div>
	</ComponentPreview>
	<!-- Always Open -->
	<ComponentPreview
		id="open"
		title="Always Open"
		description="tooltip-open forces the tooltip to show."
	>
		<div class="tooltip tooltip-open" data-tooltip="Always visible">
			<button class="button button-md button-tonal button-surface">Open</button>
		</div>
	</ComponentPreview>
	<!-- Disabled Tooltip -->
	<ComponentPreview
		id="disabled"
		title="Disabled Tooltip"
		description="tooltip-disabled silences a tooltip. Set --tooltip-enabled: 0 on an ancestor to silence a whole subtree."
	>
		<div class="tooltip tooltip-disabled" data-tooltip="Never shown">
			<button class="button button-md button-tonal button-surface">Disabled</button>
		</div>
	</ComponentPreview>
	<!-- Gap and Tail -->
	<ComponentPreview
		id="shape"
		title="Gap and Tail"
		description="tooltip-gap-*, tooltip-tail-size-* and tooltip-tail-width-* take a spacing number or an arbitrary value."
	>
		<div
			class="tooltip tooltip-gap-4 tooltip-tail-size-3 tooltip-tail-width-6"
			data-tooltip="Bigger tail, further away"
		>
			<button class="button button-md button-tonal button-surface">Custom shape</button>
		</div>
	</ComponentPreview>
</DocPage>
