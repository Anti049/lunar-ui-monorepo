import { useCallback, useRef, type PointerEvent } from 'react';

/*
	Returns a ref to attach and an onPointerDown handler:

	    const { ref, onPointerDown } = useRipple();
	    <button ref={ref} onPointerDown={onPointerDown}>…</button>

	The class name below is created by JAVASCRIPT at runtime, so Tailwind's
	scanner can never see it — which is why the plugin routes that rule through
	addBase rather than addUtilities. See guide 0, decision 3.
*/
export function useRipple() {
	const ref = useRef<HTMLElement | null>(null);

	const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
		const node = ref.current;
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

		// Self-removing, so nothing has to be cleaned up on unmount.
		circle.addEventListener('animationend', () => circle.remove());
		node.append(circle);
	}, []);

	return { ref, onPointerDown };
}
