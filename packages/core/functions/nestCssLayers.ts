import type { StyleObject } from '../types.js';

/*
	addUtilities() rejects an at-rule as a top-level key — it wants a class
	selector. Compiled output is the other way round: `@layer badge.l1.l2.l3`
	wrapping `.badge`. This inverts that nesting, so

	    { '@layer x': { '.a': {…} } }   becomes   { '.a': { '@layer x': {…} } }

	which is also how the CSS was authored by hand.
*/

type Nested = StyleObject | StyleObject[];

/** Adds a rule under a selector, turning a repeat into an array rather than
 *  overwriting — two layers can both contribute to the same selector. */
const appendRule = (styles: StyleObject, selector: string, rule: Nested): void => {
	const existing = styles[selector];
	if (existing === undefined) {
		styles[selector] = rule;
		return;
	}
	styles[selector] = (
		Array.isArray(existing) ? [...existing, rule] : [existing, rule]
	) as StyleObject[];
};

/** Re-wraps a rule in the at-rules it was found inside, innermost last. */
const wrapWithAtRules = (rule: Nested, atRules: string[]): Nested =>
	atRules.reduceRight<Nested>((wrapped, atRule) => ({ [atRule]: wrapped }) as StyleObject, rule);

const moveLayerRules = (styles: StyleObject, layerValue: Nested, atRules: string[]): void => {
	for (const block of Array.isArray(layerValue) ? layerValue : [layerValue]) {
		for (const [key, value] of Object.entries(block)) {
			// A nested at-rule: recurse, remembering it so it can be re-applied.
			if (key.startsWith('@')) {
				moveLayerRules(styles, value as Nested, [...atRules, key]);
				continue;
			}
			appendRule(styles, key, wrapWithAtRules(value as Nested, atRules));
		}
	}
};

/*
	At-rules whose children are DECLARATIONS rather than rules. There is no
	selector to hoist out of these, so they must be left exactly as they are —
	inverting them would produce nonsense.
*/
const NON_GROUPING = ['@keyframes', '@property', '@font-face', '@counter-style'];

const isGroupingAtRule = (key: string): boolean =>
	key.startsWith('@') && !NON_GROUPING.some((name) => key.startsWith(name));

export const nestCssLayers = (styles: StyleObject): Record<string, StyleObject> => {
	const nested: StyleObject = {};
	for (const [key, value] of Object.entries(styles)) {
		/*
			Every conditional group at the top level has to be turned inside out,
			not just `@layer`: addUtilities takes a class selector as its key and
			rejects `@media (width < 620px)` outright.
		*/
		if (isGroupingAtRule(key)) {
			moveLayerRules(nested, value as Nested, [key]);
			continue;
		}
		appendRule(nested, key, value as Nested);
	}
	return nested as Record<string, StyleObject>;
};
