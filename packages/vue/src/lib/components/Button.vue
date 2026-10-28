<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

type Variant = 'filled' | 'tonal' | 'outlined' | 'text';
type Size = 'sm' | 'md' | 'lg';

const props = withDefaults(
	defineProps<{
		variant?: Variant;
		size?: Size;
		class?: string;
	}>(),
	{ variant: 'filled', size: 'md', class: '' }
);

/*
	`class` is declared as a prop because inheritAttrs is off below. Merging it
	explicitly through cn() is what lets the consumer's value win — Vue's own
	attribute merging would concatenate instead.
*/
const classes = computed(() =>
	cn('button', `button-${props.variant}`, `button-${props.size}`, props.class)
);
</script>

<script lang="ts">
/*
	A second, non-setup script block, because `inheritAttrs` cannot be set inside
	`<script setup>`.

	Without it Vue appends the consumer's `class` to the element AFTER yours, so
	twMerge never sees the conflict: `rounded-full` and `rounded-sm` both land on
	the element and the cascade picks whichever came later in the stylesheet.
	That reads exactly like a specificity bug and is not one.
*/
export default { inheritAttrs: false };
</script>

<template>
	<!-- v-bind="$attrs" re-applies everything except class, which is handled above. -->
	<button :class="classes" v-bind="$attrs">
		<slot />
	</button>
</template>
