import plugin from 'tailwindcss/plugin';
import type { PluginAPI, PluginWithConfig, } from 'tailwindcss/plugin';

import bundles from './generated/imports.js';
import properties from './generated/properties.js';
import type { PluginOptions, StyleObject } from './types.js';

/*
	The design system as a standalone Tailwind plugin.

	    @import 'tailwindcss';
	    @plugin '@anti049/test' {
	      prefix: px-;
	      exclude: badge;
	    }

	Options arrive already typed by Tailwind: `prefix: px-` is a string,
	`exclude: a, b` an array, bare true/false booleans, numbers numbers. There
	is nothing to parse.
*/

/*
	Tailwind imports this type in its own declarations but never re-exports it,
	so the inferred type of the default export cannot be named. Restating it
	keeps the emitted .d.ts portable — without it, tsc writes a declaration that
	references a path inside node_modules and consumers get a broken type.
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

/** Option names the plugin understands. Anything else throws. */
const KNOWN = new Set(['prefix', 'include', 'exclude']);

const projectName: PluginWithOptions<PluginOptions> = plugin.withOptions(
	(options: PluginOptions = {}) => {
		const { prefix = '', include, exclude } = options;

		/*
			Validate here — throw, never warn. Tailwind ignores any option a
			plugin does not read, so a typo is indistinguishable from a setting
			that quietly refused to apply. A build error naming the option is the
			only feedback a consumer will ever get.
		*/
		const unknown = Object.keys(options).filter((key) => !KNOWN.has(key));
		if (unknown.length) {
			throw new Error(
				`test: unknown option${unknown.length > 1 ? 's' : ''} ${unknown.join(', ')}. ` +
					`Valid: ${[...KNOWN].join(', ')}.`
			);
		}

		/*
			`[].concat(value)` normalises the single-string case: `exclude: badge`
			arrives as a string and `exclude: a, b` as an array, and you do not
			want two code paths. `include` wins when both are given.
		*/
		const included = (name: string): boolean => {
			if (include) return ([] as string[]).concat(include).includes(name);
			if (exclude) return !([] as string[]).concat(exclude).includes(name);
			return true;
		};

		return (api: PluginAPI) => {
			// @property registrations must be unconditional, hence addBase.
			api.addBase(asCssInJs(properties));

			const addUtilities = (utilities: Record<string, StyleObject>): void => {
				api.addUtilities(utilities as unknown as Record<string, CssInJs>);
			};
			const addBase = (styles: StyleObject): void => {
				if (Object.keys(styles).length) api.addBase(asCssInJs(styles));
			};

			for (const [name, register] of Object.entries(bundles)) {
				if (!included(name)) continue;
				register({ addUtilities, addBase, prefix });
			}
		};
	}
);

export default projectName;
