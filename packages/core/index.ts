import plugin from 'tailwindcss/plugin';
import type { PluginAPI, PluginWithConfig } from 'tailwindcss/plugin';

import bundles from './generated/imports.js';
import variants from './generated/variants.js';
import properties from './generated/properties.js';
import registry from './generated/registry.js';
import theme from './generated/theme.js';
import base from './generated/base.js';
import shapeTokens from './generated/shape.js';
import themes from './generated/themes.js';
import functional from './generated/functional.js';
import { addPrefix } from './functions/addPrefix.js';
import type { PluginOptions, StyleObject } from './types.js';

/*
	The design system as a standalone Tailwind plugin.

	    @import 'tailwindcss';
	    @plugin '@anti049/lunar-ui' {
	      prefix: px-;
	      exclude: badge;
	    }

	No CSS import is needed: the design tokens the bundles depend on ship with
	the plugin (guide 14). Colours are registered through theme.extend so
	Tailwind also generates `bg-primary` and friends; the remaining tokens are
	emitted as plain custom properties.

	Options arrive already typed by Tailwind: `prefix: px-` is a string,
	`exclude: a, b` an array, bare true/false booleans, numbers numbers.
*/

/*
	Tailwind imports this type in its own declarations but never re-exports it,
	so the inferred type of the default export cannot be named. Restating it
	keeps the emitted .d.ts portable — without it, tsc writes a declaration
	referencing a path inside node_modules and consumers get a broken type.
*/
type PluginWithOptions<T> = {
	(options?: T): PluginWithConfig;
	__isOptionsFunction: true;
};

/*
	The one place StyleObject meets Tailwind's CssInJs. They are the same shape
	except that postcss-js emits numeric CSS values as JS numbers (`opacity: 0`),
	which CssInJs does not model. Tailwind stringifies them at emit time, so the
	conversion is safe; it lives here so there is one place to revisit if that
	ever stops being true.
*/
type CssInJs = Parameters<PluginAPI['addBase']>[0];
const asCssInJs = (styles: StyleObject): CssInJs => styles as unknown as CssInJs;

const projectName: PluginWithOptions<PluginOptions> = plugin.withOptions(
	(options: PluginOptions = {}) => {
		const { prefix = '', include, exclude } = options;

		/*
			`[].concat(value)` normalises the single-string case: `exclude: badge`
			arrives as a string and `exclude: a, b` as an array, and you do not
			want two code paths. `include` wins when both are given — a rule to
			document rather than an error, because the combination is usually a
			leftover rather than a mistake.
		*/
		const included = (name: string): boolean => {
			if (include) return ([] as string[]).concat(include).includes(name);
			if (exclude) return !([] as string[]).concat(exclude).includes(name);
			return true;
		};

		/*
			Which theme palettes to ship. `default` is ALWAYS included: it sits at
			`:where(:root)` with zero specificity and supplies the tone steps every
			other theme falls back to for roles it does not set itself. Dropping it
			leaves the others with unresolved colours, which renders as nothing at
			all rather than as an error.
		*/
		const requested = options.themes === undefined ? null : ([] as string[]).concat(options.themes);
		const unknown = requested?.filter((name) => !(name in themes)) ?? [];
		if (unknown.length) {
			throw new Error(
				`lunar-ui: unknown theme${unknown.length > 1 ? 's' : ''} ${unknown.join(', ')}. ` +
					`Shipped themes: ${Object.keys(themes).join(', ')}. ` +
					`Define your own with @plugin '@anti049/lunar-ui/theme'.`
			);
		}
		const selectedThemes =
			requested === null ? Object.keys(themes) : [...new Set(['default', ...requested])];

		/*
			Shape tokens given on the plugin override the defaults globally. Only
			the known names are accepted: a typo would otherwise define a variable
			nothing reads, and silently change nothing — which is exactly the
			failure this whole project tries hardest to avoid.
		*/
		const shapeOverrides: Record<string, string> = {};
		const unknownTokens: string[] = [];
		for (const [key, value] of Object.entries(options)) {
			if (!key.startsWith('--')) continue;
			if (!shapeTokens.includes(key)) {
				unknownTokens.push(key);
				continue;
			}
			if (typeof value === 'string' || typeof value === 'number') {
				shapeOverrides[key] = String(value);
			}
		}
		if (unknownTokens.length) {
			throw new Error(
				`lunar-ui: unknown token${unknownTokens.length > 1 ? 's' : ''} ` +
					`${unknownTokens.join(', ')}. Settable here: ${shapeTokens.join(', ')}. ` +
					`Colour roles belong on a theme, via @plugin '@anti049/lunar-ui/theme'.`
			);
		}

		return (api: PluginAPI) => {
			/*
				ORDER MATTERS: tokens, then themes, then overrides, so each can be
				beaten by the next.
			*/

			// Design tokens, plus the @property registrations backing Tailwind's
			// --tw-* machinery. Both must be unconditional, hence addBase.
			api.addBase(asCssInJs(base));

			for (const name of selectedThemes) {
				for (const [selector, decls] of Object.entries(themes[name] ?? {})) {
					api.addBase({ [selector]: decls });
				}
			}

			if (Object.keys(shapeOverrides).length) api.addBase({ ':root': shapeOverrides });

			api.addBase(asCssInJs(addPrefix(properties, prefix, registry)));

			for (const [name, selector] of Object.entries(variants)) {
				api.addVariant(`${prefix}${name}`, selector as string | string[] | CssInJs);
			}

			// Bundles hand over raw styles; the prefix is applied here, once, so
			// no generated registrar can forget it.
			const addUtilities = (utilities: Record<string, StyleObject>): void => {
				api.addUtilities(
					addPrefix(utilities, prefix, registry) as unknown as Record<string, CssInJs>
				);
			};

			const addBundleBase = (styles: StyleObject): void => {
				if (Object.keys(styles).length) api.addBase(asCssInJs(addPrefix(styles, prefix, registry)));
			};

			for (const [name, register] of Object.entries(bundles)) {
				if (!included(name)) continue;
				register({ addUtilities, addBase: addBundleBase, prefix });
			}

			/*
				Functional utilities (`tooltip-gap-*`). Authored in CSS as
				`@utility name-*`, which the plugin API cannot express — injecting
				the at-rule through addBase emits it verbatim and Tailwind never
				processes it — so they are re-registered here instead.
			*/
			for (const utility of functional) {
				if (!included(utility.bundle)) continue;

				/*
					Run the names through the same allowlist prefixer everything
					else uses, so `px-tooltip-gap-2` sets `--px-tooltip-gap`. The
					probe object exists only to be rewritten; its empty values are
					discarded.
				*/
				const probe = addPrefix(
					{
						[`.${utility.name}`]: Object.fromEntries(
							utility.properties.map((p: unknown) => [p, ''])
						)
					},
					prefix,
					registry
				);
				const [selector, declarations] = Object.entries(probe)[0];
				const properties = Object.keys(declarations as StyleObject);

				/*
					matchUtilities does NOT accept bare numbers unless `values` is
					supplied — `tooltip-gap-2` simply does not match without it.

					Map back to `calc(var(--spacing) * n)` rather than the resolved
					rem: that keeps the output byte-identical to the CSS-first
					build, so the parity harness stays clean, and it keeps working
					if a consumer redefines --spacing.
				*/
				const values: Record<string, string> = {};
				if (utility.spacing) {
					const spacing = api.theme('spacing') as Record<string, string> | undefined;
					for (const step of Object.keys(spacing ?? {})) {
						// `px` and friends are not numbers; --value(number) rejects
						// them too, so the two paths agree.
						if (!/^\d+(\.\d+)?$/.test(step)) continue;
						values[step] = `calc(var(--spacing) * ${step})`;
					}
				}

				api.matchUtilities(
					{
						[selector.slice(1)]: (value: string) =>
							Object.fromEntries(properties.map((p) => [p, value]))
					},
					// `['any']`, not `['length']` — the latter rejects var().
					{ values, type: utility.arbitrary ? ['any'] : [] }
				);
			}
		};
	},
	/*
		The config half. Theme values are shared Tailwind namespaces, so they are
		deliberately NOT prefixed — `--color-primary` stays `--color-primary`
		whatever the prefix, or `bg-primary` would stop working.
	*/
	() => ({ theme: { extend: theme } })
);

export default projectName;
