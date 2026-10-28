import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/*
	Returns a template ref to bind:

	    const el = useRipple();
	    <button ref="el">…</button>

	The class name below is created by JAVASCRIPT at runtime, so Tailwind's
	scanner can never see it — there is no literal `project-ripple` anywhere in
	the consumer's source, and their scan skips node_modules anyway.

	That is why the plugin routes that rule through addBase rather than
	addUtilities: addBase emits unconditionally, addUtilities is usage-gated and
	would silently emit nothing. See guide 0, decision 3.
*/
export function useRipple(): Ref<HTMLElement | null> {
	const element = ref<HTMLElement | null>(null);

	const onPointerDown = (event: PointerEvent): void => {
		const node = element.value;
		if (!node) return;

		const rect = node.getBoundingClientRect();
		const circle = document.createElement('span');

		// Diameter large enough to cover the element from any origin point.
		const diameter = Math.max(rect.width, rect.height);
		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${event.clientX - rect.left - diameter / 2}px`;
		circle.style.top = `${event.clientY - rect.top - diameter / 2}px`;

		// The one and only place this string exists.
		circle.className = 'project-ripple';

		circle.addEventListener('animationend', () => circle.remove());
		node.append(circle);
	};

	/*
		Vue has no action primitive, so the listener is attached in onMounted.

		It must be onMounted, not the setup body and not queueMicrotask: a
		template ref is null until the component has mounted, so anything earlier
		attaches to nothing and fails silently — the ripple simply never appears.
	*/
	onMounted(() => element.value?.addEventListener('pointerdown', onPointerDown));
	onBeforeUnmount(() => element.value?.removeEventListener('pointerdown', onPointerDown));

	return element;
}
