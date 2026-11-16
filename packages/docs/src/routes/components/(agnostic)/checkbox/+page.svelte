<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
</script>

<DocPage title="Checkbox" description="Lets users select one or more items from a set.">
	<!-- Header/Classes -->
	<ComponentClassTable name="checkbox" />
	<!-- Elevated -->
	<ComponentPreview id="elevated" title="Elevated Checkbox">
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-surface" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-secondary" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-tertiary" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-error" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-success" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-warning" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-info" />
		<input type="checkbox" class="checkbox checkbox-elevated checkbox-alert" />
	</ComponentPreview>
	<!-- Filled -->
	<ComponentPreview id="filled" title="Filled Checkbox">
		<input type="checkbox" class="checkbox checkbox-filled checkbox-surface" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-secondary" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-tertiary" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-error" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-success" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-warning" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-info" />
		<input type="checkbox" class="checkbox checkbox-filled checkbox-alert" />
	</ComponentPreview>
	<!-- Tonal -->
	<ComponentPreview id="tonal" title="Tonal Checkbox">
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-surface" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-secondary" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-tertiary" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-error" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-success" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-warning" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-info" />
		<input type="checkbox" class="checkbox checkbox-tonal checkbox-alert" />
	</ComponentPreview>
	<!-- Outlined -->
	<ComponentPreview id="outlined" title="Outlined Checkbox">
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-surface" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-secondary" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-tertiary" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-error" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-success" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-warning" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-info" />
		<input type="checkbox" class="checkbox checkbox-outlined checkbox-alert" />
	</ComponentPreview>
	<!-- Sizes -->
	<ComponentPreview id="sizes" title="Checkbox Sizes">
		<input type="checkbox" class="checkbox checkbox-xs checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-sm checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-md checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-lg checkbox-primary" />
		<input type="checkbox" class="checkbox checkbox-xl checkbox-primary" />
	</ComponentPreview>
</DocPage>
