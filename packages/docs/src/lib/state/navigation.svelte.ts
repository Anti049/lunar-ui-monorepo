import type { Component, Snippet } from 'svelte';

/*
	The mobile navigation drawer, which lives in the root layout.

	A section layout (docs, components) registers its links as `section`; the
	drawer then opens on them, with a Back item that switches `view` to the
	site-wide links. Picking a section there sets `browsing` to that section's
	links instead of navigating, so its pages can be chosen directly. Pages
	without a section open straight onto the site-wide links.
*/
const navigation = $state<{
	open: boolean;
	view: 'section' | 'main';
	section: Snippet | null;
	browsing: Component | null;
}>({ open: false, view: 'section', section: null, browsing: null });

export default navigation;
