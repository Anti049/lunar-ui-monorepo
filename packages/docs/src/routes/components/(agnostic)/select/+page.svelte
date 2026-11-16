<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
</script>

<DocPage title="Select" description="Lets users pick one option from a list.">
	<!-- Header/Classes -->
	<ComponentClassTable name="select" />
	<!-- Filled Select -->
	<ComponentPreview id="filled" title="Filled Select">
		<select class="select select-filled select-surface" aria-label="Surface">
			<option>Surface</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-primary" aria-label="Primary">
			<option>Primary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-secondary" aria-label="Secondary">
			<option>Secondary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-tertiary" aria-label="Tertiary">
			<option>Tertiary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-error" aria-label="Error">
			<option>Error</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-success" aria-label="Success">
			<option>Success</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-warning" aria-label="Warning">
			<option>Warning</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-info" aria-label="Info">
			<option>Info</option>
			<option>Option 2</option>
		</select>
		<select class="select select-filled select-alert" aria-label="Alert">
			<option>Alert</option>
			<option>Option 2</option>
		</select>
	</ComponentPreview>
	<!-- Tonal Select -->
	<ComponentPreview id="tonal" title="Tonal Select">
		<select class="select select-tonal select-surface" aria-label="Surface">
			<option>Surface</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-primary" aria-label="Primary">
			<option>Primary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-secondary" aria-label="Secondary">
			<option>Secondary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-tertiary" aria-label="Tertiary">
			<option>Tertiary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-error" aria-label="Error">
			<option>Error</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-success" aria-label="Success">
			<option>Success</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-warning" aria-label="Warning">
			<option>Warning</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-info" aria-label="Info">
			<option>Info</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tonal select-alert" aria-label="Alert">
			<option>Alert</option>
			<option>Option 2</option>
		</select>
	</ComponentPreview>
	<!-- Elevated Select -->
	<ComponentPreview id="elevated" title="Elevated Select">
		<select class="select select-elevated select-surface" aria-label="Surface">
			<option>Surface</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-primary" aria-label="Primary">
			<option>Primary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-secondary" aria-label="Secondary">
			<option>Secondary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-tertiary" aria-label="Tertiary">
			<option>Tertiary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-error" aria-label="Error">
			<option>Error</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-success" aria-label="Success">
			<option>Success</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-warning" aria-label="Warning">
			<option>Warning</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-info" aria-label="Info">
			<option>Info</option>
			<option>Option 2</option>
		</select>
		<select class="select select-elevated select-alert" aria-label="Alert">
			<option>Alert</option>
			<option>Option 2</option>
		</select>
	</ComponentPreview>
	<!-- Outlined Select -->
	<ComponentPreview id="outlined" title="Outlined Select">
		<select class="select select-outlined select-surface" aria-label="Surface">
			<option>Surface</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-primary" aria-label="Primary">
			<option>Primary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-secondary" aria-label="Secondary">
			<option>Secondary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-tertiary" aria-label="Tertiary">
			<option>Tertiary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-error" aria-label="Error">
			<option>Error</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-success" aria-label="Success">
			<option>Success</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-warning" aria-label="Warning">
			<option>Warning</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-info" aria-label="Info">
			<option>Info</option>
			<option>Option 2</option>
		</select>
		<select class="select select-outlined select-alert" aria-label="Alert">
			<option>Alert</option>
			<option>Option 2</option>
		</select>
	</ComponentPreview>
	<!-- Text Select -->
	<ComponentPreview id="text" title="Text Select">
		<select class="select select-surface select-text" aria-label="Surface">
			<option>Surface</option>
			<option>Option 2</option>
		</select>
		<select class="select select-primary select-text" aria-label="Primary">
			<option>Primary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-secondary select-text" aria-label="Secondary">
			<option>Secondary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-tertiary select-text" aria-label="Tertiary">
			<option>Tertiary</option>
			<option>Option 2</option>
		</select>
		<select class="select select-error select-text" aria-label="Error">
			<option>Error</option>
			<option>Option 2</option>
		</select>
		<select class="select select-success select-text" aria-label="Success">
			<option>Success</option>
			<option>Option 2</option>
		</select>
		<select class="select select-warning select-text" aria-label="Warning">
			<option>Warning</option>
			<option>Option 2</option>
		</select>
		<select class="select select-info select-text" aria-label="Info">
			<option>Info</option>
			<option>Option 2</option>
		</select>
		<select class="select select-alert select-text" aria-label="Alert">
			<option>Alert</option>
			<option>Option 2</option>
		</select>
	</ComponentPreview>
	<!-- Select Sizes -->
	<ComponentPreview id="sizes" title="Select Sizes">
		<select class="select select-xs select-primary" aria-label="XS">
			<option>XS</option>
		</select>
		<select class="select select-sm select-primary" aria-label="SM">
			<option>SM</option>
		</select>
		<select class="select select-md select-primary" aria-label="MD">
			<option>MD</option>
		</select>
		<select class="select select-lg select-primary" aria-label="LG">
			<option>LG</option>
		</select>
		<select class="select select-xl select-primary" aria-label="XL">
			<option>XL</option>
		</select>
	</ComponentPreview>
	<!-- Disabled Select -->
	<ComponentPreview
		id="disabled"
		title="Disabled Select"
		description="Use the disabled attribute, .disabled or select-disabled."
	>
		<select class="select select-primary" disabled aria-label="Disabled">
			<option>Disabled</option>
		</select>
	</ComponentPreview>
</DocPage>
