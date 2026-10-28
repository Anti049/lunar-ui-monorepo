<script setup lang="ts">
// From the source barrel, not the built package, so the playground reflects
// your edits without a build.
import { Button } from '../lib';
</script>

<template>
	<div class="flex flex-wrap items-center gap-2 p-8">
		<Button variant="filled">Filled</Button>
		<Button variant="tonal">Tonal</Button>
		<Button variant="outlined" disabled>Disabled</Button>
	</div>
</template>
