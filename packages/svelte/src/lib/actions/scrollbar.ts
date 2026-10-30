import { createSubscriber } from 'svelte/reactivity';

/*
	Drives `.scrollbar-fade`: marks an element `data-scrolling` while it is being
	scrolled, which the CSS reads to show the scrollbar. CSS cannot tell when
	scrolling stops, so this is the one part it needs help with; the fade-out
	delay itself stays in CSS (--scrollbar-fade-delay).

	One delegated listener for the whole document, like initRipple. `scroll`
	does not bubble, so it listens in the capture phase.
*/

const SCROLLING_ATTR = 'data-scrolling';
const MARKER = '--scrollbar-fade';
const DEFAULT_IDLE = 150;

export interface ScrollbarFadeOptions {
	/**
	 * Quiet time in ms after the last scroll event before the element counts
	 * as no longer scrolling. Default 150. The visible delay before the bar
	 * fades is this plus the CSS --scrollbar-fade-delay.
	 */
	idle?: number;
}

export function initScrollbarFade(
	target: Document | HTMLElement = document,
	options: ScrollbarFadeOptions = {}
): () => void {
	const idle = options.idle ?? DEFAULT_IDLE;
	const timers = new Map<Element, ReturnType<typeof setTimeout>>();
	// Whether an element carries the marker, read once per element: computed
	// style is too costly to query on every scroll event.
	const fades = new WeakMap<Element, boolean>();

	function onScroll(event: Event) {
		// Page scrolls are reported on the document, not an element.
		const el = event.target === document ? document.scrollingElement : event.target;
		if (!(el instanceof Element)) return;

		let marked = fades.get(el);
		if (marked === undefined) {
			marked = getComputedStyle(el).getPropertyValue(MARKER).trim() !== '';
			fades.set(el, marked);
		}
		if (!marked) return;

		el.setAttribute(SCROLLING_ATTR, '');
		clearTimeout(timers.get(el));
		timers.set(
			el,
			setTimeout(() => {
				el.removeAttribute(SCROLLING_ATTR);
				timers.delete(el);
			}, idle)
		);
	}

	target.addEventListener('scroll', onScroll, { capture: true, passive: true });

	return () => {
		target.removeEventListener('scroll', onScroll, { capture: true });
		for (const [el, timer] of timers) {
			clearTimeout(timer);
			el.removeAttribute(SCROLLING_ATTR);
		}
		timers.clear();
	};
}

/*
	A document-wide switch over initScrollbarFade, like enableRipple. With it
	off, `.scrollbar-fade` still shows on hover and focus; only showing while
	scrolling needs it.
*/
let stopDocumentFade: (() => void) | null = null;
/*
	Makes isScrollbarFadeEnabled() reactive without a rune, so this stays a plain .ts
	module that works uncompiled (a `$state` here would need the consumer's
	Svelte compiler to run on it). Reading it inside an effect or template
	subscribes; enabling or disabling notifies.
*/
let notifyScrollbarFade = (): void => {};
const subscribeScrollbarFade = createSubscriber((update) => {
	notifyScrollbarFade = update;
	return () => (notifyScrollbarFade = () => {});
});

/** Starts document-wide scrollbar fading, unless it is already on. */
export function enableScrollbarFade(options: ScrollbarFadeOptions = {}): void {
	stopDocumentFade ??= initScrollbarFade(document, options);
	notifyScrollbarFade();
}

/** Stops it, and clears `data-scrolling` from anything mid-scroll. */
export function disableScrollbarFade(): void {
	stopDocumentFade?.();
	stopDocumentFade = null;
	notifyScrollbarFade();
}

export function isScrollbarFadeEnabled(): boolean {
	subscribeScrollbarFade();
	return stopDocumentFade !== null;
}
