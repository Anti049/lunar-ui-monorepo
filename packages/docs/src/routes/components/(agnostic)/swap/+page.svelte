<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	import { Sun, Moon } from '@lucide/svelte';
</script>

<DocPage title="Swap" description="Toggles between two elements based on a checkbox state.">
	<!-- Header/Classes -->
	<ComponentClassTable name="swap" />
	<!-- Basic -->
	<ComponentPreview id="swap" title="Swap" description="Click to toggle between two elements.">
		<label class="swap text-title-large-emphasized">
			<input type="checkbox" />
			<span class="swap-on text-primary">ON</span>
			<span class="swap-off text-on-surface-variant">OFF</span>
		</label>
	</ComponentPreview>
	<!-- Rotate -->
	<ComponentPreview
		id="swap-rotate"
		title="Rotate"
		description="Rotates the icons as they cross-fade."
	>
		<label class="swap swap-rotate">
			<input type="checkbox" />
			<Sun class="size-8 swap-on" />
			<Moon class="size-8 swap-off" />
		</label>
	</ComponentPreview>
	<!-- Flip -->
	<ComponentPreview id="swap-flip" title="Flip" description="3D flip between the icons.">
		<label class="swap swap-flip">
			<input type="checkbox" />
			<Sun class="size-8 swap-on" />
			<Moon class="size-8 swap-off" />
		</label>
	</ComponentPreview>
</DocPage>
