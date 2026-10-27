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

/** Options a consumer may pass in the `@plugin` body. */
export interface PluginOptions {
	/** Renames the plugin's own classes and locals, e.g. `px-`. */
	prefix?: string;
	/** Bundles to register; omit for all. */
	include?: string | string[];
	/** Bundles to skip. Ignored when `include` is given. */
	exclude?: string | string[];
}
