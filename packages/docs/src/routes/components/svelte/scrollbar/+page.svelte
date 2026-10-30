<script lang="ts">
	import {
		disableScrollbarFade,
		enableScrollbarFade,
		isScrollbarFadeEnabled
	} from '@anti049/lunar-ui-svelte';

	// Reactive: isScrollbarFadeEnabled() is $state in the library, so this follows the
	// switch wherever it is flipped (the root layout turns it on).
	let enabled = $derived(isScrollbarFadeEnabled());

	function toggle() {
		if (enabled) disableScrollbarFade();
		else enableScrollbarFade();
	}
</script>

<div class="flex flex-col items-start gap-4">
	<button class="button button-tonal button-primary" onclick={toggle}>
		{enabled ? 'Disable' : 'Enable'} scrollbar fade
	</button>
	<!-- With the fade off, the bar still shows on hover and focus, just not while scrolling. -->
	<div
		class="scrollbar h-48 w-64 overflow-y-auto rounded-sm surface-container-low p-2 scrollbar-fade"
	>
		{#each { length: 30 }, i (i)}
			<p>Line {i + 1}</p>
		{/each}
	</div>
</div>
