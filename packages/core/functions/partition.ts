import postcss from 'postcss';
import { objectify } from 'postcss-js';
import type { Bundle, StyleObject } from '../types.js';

/*
	The bundle that owns a `@layer` block, read from its first segment.

	One or more `.lN` segments follow the name, because tiers nest. Anchoring
	this to a single `.lN` breaks the moment a tier is nested — and the symptom
	is a confusing report about Tailwind built-ins rather than a parse error.
*/
const LAYER_OWNER = /^([a-z][\w-]*)(?:\.l\d+)+$/;

export interface Partitioned {
	components: Record<string, Bundle>;
	properties: StyleObject;
	unattributed: string[];
}

/**
 * Splits a whole-library compile into per-bundle buckets.
 *
 * Attribution runs off the naming discipline chosen in guide 0: component
 * rules live in `@layer <component>.l1[.l2[.l3]]`, and keyframes are named
 * `<component>-*`. Shared utilities carry no layer marker of their own, so
 * they are attributed by class name via `classOwners`. Anything unattributed
 * is context — theme, preflight — and is dropped.
 */
export function partition(
	css: string,
	components: string[],
	classOwners: ReadonlyMap<string, string> = new Map()
): Partitioned {
	const root = postcss.parse(css);
	const owners = new Set(components);
	const extraBundles = new Set(classOwners.values());

	const buckets: Record<string, { utilities: postcss.Root; standalone: postcss.Root }> =
		Object.fromEntries(
			[...components, ...extraBundles].map((name) => [
				name,
				{ utilities: postcss.root(), standalone: postcss.root() }
			])
		);
	const properties = postcss.root();
	const unattributed: string[] = [];

	const ownerOf = (node: postcss.ChildNode): string | null => {
		// 1. The layer marker, which is the reliable signal.
		if (node.type === 'atrule' && node.name === 'layer') {
			const owner = LAYER_OWNER.exec(node.params.trim())?.[1];
			if (owner && owners.has(owner)) return owner;
		}
		// 2. Keyframes, named after the component that animates with them.
		if (node.type === 'atrule' && node.name === 'keyframes') {
			const name = node.params.trim();
			for (const c of components) if (name === c || name.startsWith(`${c}-`)) return c;
		}
		// 3. Class name. Shared utilities carry no @layer marker of their own —
		//    `@utility surface` lands as a bare `.surface` inside @layer
		//    utilities — so they are attributed by the classes they define.
		if (node.type === 'rule') {
			for (const match of node.selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
				const owner = classOwners.get(match[1]);
				if (owner) return owner;
			}
		}
		/*
			4. A layer whose name is not a bundle. Layer names are not always file
			   names — collapsible.css may emit `@layer collapse.lN` — so fall
			   back to the classes inside before giving up.
		*/
		if (node.type === 'atrule') {
			let owner: string | null = null;
			node.walkRules((rule) => {
				if (owner) return false;
				for (const match of rule.selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
					const candidate = classOwners.get(match[1]);
					if (candidate) {
						owner = candidate;
						return false;
					}
				}
				return undefined;
			});
			if (owner) return owner;
		}
		return null; // context — dropped, and reported
	};

	const take = (node: postcss.ChildNode, bucket: 'utilities' | 'standalone'): boolean => {
		const owner = ownerOf(node);
		if (owner) {
			buckets[owner][bucket].append(node.clone());
			return true;
		}
		return false;
	};

	root.each((node) => {
		if (node.type === 'comment') return;

		// Everything Tailwind emitted from an @utility lands here. It is
		// usage-gated, which is what you want, so it goes to addUtilities.
		if (node.type === 'atrule' && node.name === 'layer' && node.params === 'utilities') {
			node.each((child) => {
				if (!take(child, 'utilities')) unattributed.push(describe(child));
			});
			return;
		}
		// @property registrations back Tailwind's --tw-* machinery. They are
		// global and must be unconditional, so they go to addBase, not a bundle.
		if (node.type === 'atrule' && node.name === 'property') {
			properties.append(node.clone());
			return;
		}
		if (node.type === 'atrule' && node.name === 'layer' && node.params === 'properties') {
			node.each((child) => {
				properties.append(child.clone());
			});
			return;
		}
		if (!take(node, 'standalone')) unattributed.push(describe(node));
	});

	return {
		components: Object.fromEntries(
			Object.entries(buckets).map(([name, b]) => [
				name,
				{
					utilities: kebabCaseProperties(objectify(b.utilities)) as StyleObject,
					standalone: kebabCaseProperties(objectify(b.standalone)) as StyleObject,
					// Filled in by build.ts, which knows which classes JS creates.
					unconditional: {}
				}
			])
		),
		properties: kebabCaseProperties(objectify(properties)) as StyleObject,
		unattributed
	};
}

/** A human-readable label for a dropped node, for the build's report. */
const describe = (node: postcss.ChildNode): string =>
	node.type === 'atrule' ? `@${node.name} ${node.params}`.trim() : (node as postcss.Rule).selector;

/*
	postcss-js camelCases declaration properties, and Tailwind converts them back
	— except when the value is an ARRAY, which is how a repeated declaration is
	represented (a `transition-duration` given twice as a fallback). Those keys
	reach the browser verbatim as `transitionDuration`, which browsers drop.

	Emitting kebab-case throughout sidesteps the conversion entirely.
*/
const isDeclarationValue = (value: unknown): boolean => {
	if (Array.isArray(value)) return value.length === 0 || typeof value[0] !== 'object';
	return typeof value !== 'object' || value === null;
};

/*
	postcss-js's own encoding, reversed. Vendor prefixes are why this is not a
	plain camel-to-kebab: `-webkit-user-select` round-trips as
	`WebkitUserSelect`, so a LEADING capital has to become a leading dash, and
	`-ms-` is the odd one out that postcss-js encodes lowercase.
*/
const toKebab = (property: string): string =>
	property
		.replace(/([A-Z])/g, '-$1')
		.replace(/^ms-/, '-ms-')
		.toLowerCase();

/** Rewrites declaration keys only; selectors, at-rules and custom properties
 *  are left exactly as they are. */
export function kebabCaseProperties<T>(node: T): T {
	if (Array.isArray(node)) return node.map(kebabCaseProperties) as unknown as T;
	if (node === null || typeof node !== 'object') return node;
	return Object.fromEntries(
		Object.entries(node as Record<string, unknown>).map(([key, value]) => {
			if (key.startsWith('--') || key.startsWith('@') || !isDeclarationValue(value)) {
				return [key, kebabCaseProperties(value)];
			}
			return [toKebab(key), value];
		})
	) as T;
}
