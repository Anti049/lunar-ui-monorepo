/*
	Shared shapes for the generated data and the runtime that consumes it.

	`StyleObject` is structurally Tailwind's own `CssInJs`, restated here so the
	build scripts — which never import from tailwindcss — can use it too.
*/

/*
	Note the `number`: postcss-js converts numeric CSS values to JS numbers, so
	`opacity: 0` round-trips as a number, not a string. Tailwind's own `CssInJs`
	does not allow that — see the cast in index.ts, which is the one place the
	two types meet.
*/
export type StyleObject = {
	[key: string]: string | number | string[] | StyleObject | StyleObject[];
};

/** One bundle's rules, split by the plugin channel each one needs. */
export interface Bundle {
	/** From `@utility`; Tailwind wraps these in `@layer utilities`. */
	utilities: StyleObject;
	/** From plain selectors; emitted in a top-level layer. */
	standalone: StyleObject;
	/**
	 * Rules for classes created at runtime by JavaScript, which Tailwind can
	 * never see as a candidate. They go through addBase so they are emitted
	 * unconditionally rather than being usage-gated away.
	 */
	unconditional: StyleObject;
}

/** Registers one bundle's rules. One of these is generated per bundle. */
export type BundleRegistrar = (context: {
	addUtilities: (utilities: Record<string, StyleObject>) => void;
	addBase: (base: StyleObject) => void;
	prefix?: string;
}) => void;

/**
 * A `theme.extend` entry. A plain value, or a `[value, modifiers]` tuple for
 * namespaces that take them. Added by guide 14.
 */
export type ThemeEntry = string | [string, Record<string, string>];
export type ThemeExtend = Record<string, Record<string, ThemeEntry>>;

/** Shipped theme palettes, keyed by theme id then by selector. Guide 15. */
export type ThemeRules = Record<string, Record<string, Record<string, string>>>;

/** Re-exported so generated/swatches.ts can name its own shape. Guide 15. */
export type { SwatchRole, ThemeSwatches } from './functions/extract-swatches.js';

/**
 * Names the design system owns, used to decide what a `prefix` may rename.
 * Added by THIS guide.
 */
export interface Registry {
	classes: string[];
	/** Custom property names, WITHOUT the leading `--`. */
	variables: string[];
}

/**
 * A functional utility — `@utility tooltip-gap-*`, registered at runtime with
 * matchUtilities because its class names cannot be enumerated at build time.
 * Added by THIS guide.
 */
export interface FunctionalUtility {
	/** Owning bundle, so include/exclude applies to these too. */
	bundle: string;
	/** Class stem without the trailing `-*`, e.g. `tooltip-gap`. */
	name: string;
	/** Properties the resolved value is written to. */
	properties: string[];
	/** Accepts a number off the spacing scale (`tooltip-gap-2`). */
	spacing: boolean;
	/** Accepts an arbitrary value (`tooltip-gap-[3px]`). */
	arbitrary: boolean;
}

/** Options a consumer may pass in the `@plugin` body. */
export interface PluginOptions {
	/** Renames the design system's own classes and locals, e.g. `px-`. */
	prefix?: string;
	/** Bundles to register; omit for all. */
	include?: string | string[];
	/** Bundles to skip. Ignored when `include` is given. */
	exclude?: string | string[];
	/**
	 * Shipped theme palettes to include. Omit for all. The `default` theme is
	 * always added: other themes inherit from it for roles they do not set.
	 */
	themes?: string | string[];
	/**
	 * Shape tokens, set as CSS custom properties. Anything else beginning with
	 * `--` is rejected — a typo would otherwise define a variable nothing reads
	 * and silently change nothing.
	 */
	[token: `--${string}`]: string | number | undefined;
}
