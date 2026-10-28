import type { Registry, StyleObject } from '../types.js';

/*
	Prefixes the design system's own class names and custom properties.

	This works off an ALLOWLIST generated at build time from the component
	sources (generated/registry.ts). A name is renamed only when the design
	system actually defines it, so Tailwind's theme variables, consumer state
	hooks like `.disabled`, and third-party classes are left alone by
	construction rather than by remembering to exclude them.

	The alternative — prefix everything and keep a denylist of exceptions, which
	is what several popular plugins do — fails the first time a consumer has a
	class whose name collides with one of yours. The failure is a renamed class
	in THEIR markup, which looks like their bug.

	RUNTIME MODULE: index.ts imports this, so it ships in dist/. No node: imports.
*/

const BACKSLASH = '\\';

/**
 * Rewrites `.foo` in a selector, skipping quoted strings, comments and the
 * insides of `[attr=...]`.
 *
 * A regex cannot do this. Each of the four cases handled below produces
 * plausible-looking CSS rather than an error, which is the worst way to fail.
 */
const prefixSelector = (selector: string, prefix: string, classes: ReadonlySet<string>): string => {
	let out = '';
	let quote = '';
	let bracketDepth = 0;

	for (let i = 0; i < selector.length; i++) {
		const ch = selector[i];

		// 1. Inside a quoted string: copy through, honouring escapes.
		if (quote) {
			out += ch;
			if (ch === BACKSLASH) {
				out += selector[++i] ?? '';
			} else if (ch === quote) {
				quote = '';
			}
			continue;
		}
		if (ch === '"' || ch === "'") {
			quote = ch;
			out += ch;
			continue;
		}

		/*
			2. Comments, skipped wholesale. Their contents must not drive the
			state machine: an apostrophe inside a comment would otherwise open a
			quote that never closes, and a stray "[" would leave bracketDepth
			stuck, silently skipping every class after it.
		*/
		if (ch === '/' && selector[i + 1] === '*') {
			const end = selector.indexOf('*/', i + 2);
			const stop = end === -1 ? selector.length : end + 2;
			out += selector.slice(i, stop);
			i = stop - 1;
			continue;
		}

		/*
			3. An escaped character, e.g. `.w-1\/2`. Copy both through, so the
			`/2` is never mistaken for the start of a new class.
		*/
		if (ch === BACKSLASH) {
			out += ch + (selector[++i] ?? '');
			continue;
		}

		// 4. Attribute selectors: `[data-state='x.y']` holds a dot that is not
		//    a class.
		if (ch === '[') bracketDepth++;
		else if (ch === ']' && bracketDepth > 0) bracketDepth--;

		if (ch === '.' && bracketDepth === 0) {
			const name = /^-?[_a-zA-Z][\w-]*/.exec(selector.slice(i + 1))?.[0];
			if (name && classes.has(name)) {
				out += '.' + prefix + name;
				i += name.length;
				continue;
			}
		}
		out += ch;
	}
	return out;
};

const VAR_REFERENCE = /--([-\w]+)/g;

/** Renames `var(--x)` references, but only for variables in the registry. */
const prefixValue = (value: string, prefix: string, variables: ReadonlySet<string>): string =>
	value.replace(VAR_REFERENCE, (match, name: string) =>
		variables.has(name) ? '--' + prefix + name : match
	);

const prefixKey = (
	key: string,
	prefix: string,
	classes: ReadonlySet<string>,
	variables: ReadonlySet<string>
): string => {
	// A custom property declaration.
	if (key.startsWith('--')) {
		const name = key.slice(2);
		return variables.has(name) ? '--' + prefix + name : key;
	}
	/*
		@property is the ONE at-rule whose params are a variable name. Treat it
		like every other at-rule and a prefixed build registers
		`--px-ripple-scale` while the @property declaration still says
		`--ripple-scale` — so the registration silently does not apply and the
		animation stops working.
	*/
	if (key.startsWith('@property --')) return prefixValue(key, prefix, variables);
	// Every other at-rule (@layer, @media, @supports) passes through untouched.
	if (key.startsWith('@')) return key;
	return prefixSelector(key, prefix, classes);
};

const asSet = (value: ReadonlySet<string> | readonly string[]): ReadonlySet<string> =>
	value instanceof Set ? value : new Set(value as readonly string[]);

export function addPrefix<T extends StyleObject>(styles: T, prefix: string, registry: Registry): T {
	// No prefix is the common case: do no work, allocate nothing.
	if (!prefix) return styles;

	const classes = asSet(registry.classes);
	const variables = asSet(registry.variables);

	const walk = (node: unknown): unknown => {
		if (Array.isArray(node)) return node.map(walk);
		if (node === null || typeof node !== 'object') {
			return typeof node === 'string' ? prefixValue(node, prefix, variables) : node;
		}
		return Object.fromEntries(
			Object.entries(node as StyleObject).map(([key, value]) => [
				prefixKey(key, prefix, classes, variables),
				walk(value)
			])
		);
	};

	return walk(styles) as T;
}
