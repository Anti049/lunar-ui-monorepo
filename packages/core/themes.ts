import swatches from './generated/swatches.js';
import { SWATCH_ROLES, type SwatchRole, type ThemeSwatches } from './functions/extract-swatches.js';

/*
	The theme catalogue, for JavaScript.

	    import { THEME_NAMES, THEME_SWATCHES } from '@anti049/lunar-ui/themes';

	Enough to build a theme picker without hard-coding names or reading computed
	styles off the DOM. DATA ONLY — importing this does not load the plugin, and
	it is not the thing you pass to `@plugin`.

	Deliberately free of runtime dependencies. Resolving a theme you generate
	yourself needs `swatchesFor` from `/theme`, which pulls in
	material-color-utilities — a package whose extensionless internal imports
	Node's ESM resolver rejects outright. Keeping that out of here means a list
	of names costs nothing and works in any runtime, including a docs site's SSR.
*/

export { SWATCH_ROLES };
export type { SwatchRole, ThemeSwatches };

/** Every `data-theme` value the shipped themes answer to, sorted. */
export const THEME_NAMES: string[] = Object.keys(swatches);

/** Representative colours per shipped theme, both modes. */
export const THEME_SWATCHES: Record<string, ThemeSwatches> = swatches;
