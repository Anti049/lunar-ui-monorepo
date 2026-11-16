<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
</script>

<DocPage title="Badge" description="A compact label for counts, statuses and indicators.">
	<!-- Header/Classes -->
	<ComponentClassTable name="badge" />
	<!-- Filled -->
	<ComponentPreview id="filled" title="Filled Badge">
		<span class="badge badge-filled badge-surface">Surface</span>
		<span class="badge badge-filled badge-primary">Primary</span>
		<span class="badge badge-filled badge-secondary">Secondary</span>
		<span class="badge badge-filled badge-tertiary">Tertiary</span>
		<span class="badge badge-filled badge-error">Error</span>
		<span class="badge badge-filled badge-success">Success</span>
		<span class="badge badge-filled badge-warning">Warning</span>
		<span class="badge badge-filled badge-info">Info</span>
		<span class="badge badge-filled badge-alert">Alert</span>
	</ComponentPreview>
	<!-- Tonal -->
	<ComponentPreview id="tonal" title="Tonal Badge">
		<span class="badge badge-tonal badge-surface">Surface</span>
		<span class="badge badge-tonal badge-primary">Primary</span>
		<span class="badge badge-tonal badge-secondary">Secondary</span>
		<span class="badge badge-tonal badge-tertiary">Tertiary</span>
		<span class="badge badge-tonal badge-error">Error</span>
		<span class="badge badge-tonal badge-success">Success</span>
		<span class="badge badge-tonal badge-warning">Warning</span>
		<span class="badge badge-tonal badge-info">Info</span>
		<span class="badge badge-tonal badge-alert">Alert</span>
	</ComponentPreview>
	<!-- Elevated -->
	<ComponentPreview id="elevated" title="Elevated Badge">
		<span class="badge badge-elevated badge-surface">Surface</span>
		<span class="badge badge-elevated badge-primary">Primary</span>
		<span class="badge badge-elevated badge-secondary">Secondary</span>
		<span class="badge badge-elevated badge-tertiary">Tertiary</span>
		<span class="badge badge-elevated badge-error">Error</span>
		<span class="badge badge-elevated badge-success">Success</span>
		<span class="badge badge-elevated badge-warning">Warning</span>
		<span class="badge badge-elevated badge-info">Info</span>
		<span class="badge badge-elevated badge-alert">Alert</span>
	</ComponentPreview>
	<!-- Outlined -->
	<ComponentPreview id="outlined" title="Outlined Badge">
		<span class="badge badge-outlined badge-surface">Surface</span>
		<span class="badge badge-outlined badge-primary">Primary</span>
		<span class="badge badge-outlined badge-secondary">Secondary</span>
		<span class="badge badge-outlined badge-tertiary">Tertiary</span>
		<span class="badge badge-outlined badge-error">Error</span>
		<span class="badge badge-outlined badge-success">Success</span>
		<span class="badge badge-outlined badge-warning">Warning</span>
		<span class="badge badge-outlined badge-info">Info</span>
		<span class="badge badge-outlined badge-alert">Alert</span>
	</ComponentPreview>
	<!-- Text -->
	<ComponentPreview id="text" title="Text Badge">
		<span class="badge badge-text badge-surface">Surface</span>
		<span class="badge badge-text badge-primary">Primary</span>
		<span class="badge badge-text badge-secondary">Secondary</span>
		<span class="badge badge-text badge-tertiary">Tertiary</span>
		<span class="badge badge-text badge-error">Error</span>
		<span class="badge badge-text badge-success">Success</span>
		<span class="badge badge-text badge-warning">Warning</span>
		<span class="badge badge-text badge-info">Info</span>
		<span class="badge badge-text badge-alert">Alert</span>
	</ComponentPreview>
	<!-- Dot -->
	<ComponentPreview id="dot" title="Dot Badge" description="An empty badge renders as a round dot.">
		<span class="badge badge-surface"></span>
		<span class="badge badge-primary"></span>
		<span class="badge badge-secondary"></span>
		<span class="badge badge-tertiary"></span>
		<span class="badge badge-error"></span>
		<span class="badge badge-success"></span>
		<span class="badge badge-warning"></span>
		<span class="badge badge-info"></span>
		<span class="badge badge-alert"></span>
	</ComponentPreview>
	<!-- Counts -->
	<ComponentPreview id="counts" title="Counts" description="Badges grow to fit their content.">
		<span class="badge badge-error">1</span>
		<span class="badge badge-error">12</span>
		<span class="badge badge-error">99+</span>
	</ComponentPreview>
	<!-- Disabled -->
	<ComponentPreview
		id="disabled"
		title="Disabled Badge"
		description="Use badge-disabled, .disabled or [disabled]."
	>
		<span class="badge badge-disabled badge-primary">Disabled</span>
		<span class="badge disabled badge-primary"></span>
	</ComponentPreview>
	<!-- Animations -->
	<ComponentPreview
		id="animations"
		title="Animated Badge"
		description="badge-animate-alert pulses a halo; badge-animate-bounce bounces the badge."
	>
		<span class="badge badge-animate-alert badge-error"></span>
		<span class="badge badge-animate-alert badge-success">Live</span>
		<span class="badge badge-animate-bounce badge-primary">New</span>
	</ComponentPreview>
</DocPage>
