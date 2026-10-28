/*
	A Svelte action: `<button use:ripple>`.

	The class name below is created by JAVASCRIPT at runtime, so Tailwind's
	scanner can never see it — there is no literal `project-ripple` anywhere in
	the consumer's source, and their scan skips node_modules anyway.

	That is why the plugin routes this rule through `addBase` rather than
	`addUtilities`: addBase emits unconditionally, addUtilities is usage-gated
	and would silently emit nothing. See guide 0, decision 3.
*/
export function ripple(node: HTMLElement): { destroy(): void } {
	const onPointerDown = (event: PointerEvent): void => {
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

	node.addEventListener('pointerdown', onPointerDown);

	// Svelte calls destroy() when the element is removed. Without this the
	// listener outlives the node in a long-lived SPA.
	return {
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
		}
	};
}
