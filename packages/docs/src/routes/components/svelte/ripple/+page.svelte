<script lang="ts">
	import { disableRipple, enableRipple, isRippleEnabled } from '@anti049/lunar-ui-svelte';
	import DocPage from '#lib/components/DocPage.svelte';

	// Reactive: isRippleEnabled() is $state in the library, so this follows the
	// switch wherever it is flipped (the root layout turns it on).
	let enabled = $derived(isRippleEnabled());

	function toggle() {
		if (enabled) disableRipple();
		else enableRipple();
	}
</script>

<DocPage title="Ripple" description="Configure the ripple effect">
	<div class="mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center gap-4">
		<button class="button button-tonal button-primary" onclick={toggle}>
			{enabled ? 'Disable' : 'Enable'} ripple
		</button>
		<div
			class="interactive flex min-h-16 w-full flex-1 items-center justify-center rounded-sm border-2 border-surface-container surface-container-lowest before:hidden"
		>
			<span class="text-headlime-medium select-none">Click Me!</span>
		</div>
	</div>
</DocPage>
