import postcss from 'postcss';

const CLASS_IN_SELECTOR = /\.(-?[_a-zA-Z][\w-]*)/g;

/*
	Generic state hooks the design system reads but does not own. They appear in
	component selectors (`.badge.disabled`) yet belong to the consumer's markup,
	so a prefix must never rename them and they are never safelisted as ours.
*/
const STATE_HOOKS = new Set([
	'disabled',
	'selected',
	'active',
	'checked',
	'open',
	'collapsed',
	'dragged'
]);

/**
 * Class names a stylesheet defines.
 *
 * `@utility` blocks are authoritative. Plain class selectors are only counted
 * when they sit in the given namespace — otherwise Tailwind built-ins that the
 * file merely references (`.sr-only`) get claimed as ours and renamed under a
 * prefix. Shared utilities are not namespaced (`surface`, `elevation-1`), so
 * they pass `namespace: null`, which accepts any plain class that is not a
 * state hook.
 *
 * Tailwind emits an `@utility` only when something references it, so the list
 * this returns is fed back into the compile as a safelist.
 */
export function extractClasses(css: string, namespace: string | null): string[] {
	const root = postcss.parse(css);
	const classes = new Set<string>();

	root.walkAtRules('utility', (rule) => {
		const name = rule.params.trim();
		// Functional utilities (`badge-gap-*`) have no finite set of names to
		// safelist, so they are not candidates. Guide 16 reads them separately
		// and re-registers them through matchUtilities.
		if (name.includes('*')) return;
		classes.add(name);
	});

	/*
		A file's own `@utility` names describe what it owns better than its file
		name does: collapsible.css may declare `collapse`, navigation.css may
		declare `nav-rail`. Filtering plain selectors by file name alone would
		drop those, so the declared utilities widen the namespace.
	*/
	const namespaces = namespace === null ? null : [namespace, ...classes];
	const owned = (name: string): boolean =>
		namespaces === null || namespaces.some((ns) => name === ns || name.startsWith(`${ns}-`));

	root.walkRules((rule) => {
		// Selectors inside an @utility block were handled above.
		if (rule.parent?.type === 'atrule' && (rule.parent as postcss.AtRule).name === 'utility') {
			return;
		}
		for (const match of rule.selector.matchAll(CLASS_IN_SELECTOR)) {
			const name = match[1];
			if (STATE_HOOKS.has(name)) continue;
			if (!owned(name)) continue;
			classes.add(name);
		}
	});

	// Sorted, so generated output does not reorder between machines.
	return [...classes].sort();
}
