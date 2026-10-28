/*
	Flat config, one file for the whole monorepo.

	One config rather than one per package, because two configs drift: a rule
	enabled in `packages/react` and not in `packages/svelte` becomes a rule
	nobody can explain six months later.

	Order matters throughout — later entries override earlier ones.
*/
import path from 'node:path';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import vue from 'eslint-plugin-vue';
import react from 'eslint-plugin-react';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	/*
		Reuse .gitignore rather than maintaining a second list. Everything ESLint
		should skip — node_modules, dist, .svelte-kit, packages/core/generated — is
		already in there, and the two cannot drift apart.
	*/
	includeIgnoreFile(gitignorePath),
	// Committed but not ours: Obsidian's config and its bundled plugins.
	globalIgnores(['**/.obsidian/']),

	js.configs.recommended,
	ts.configs.recommended,

	/*
		Svelte and Vue scope themselves to their own file types. React does NOT —
		`react.configs.flat.recommended` carries no `files` key, so left as-is it
		lints every .js and .ts in the repository with React rules, including
		this config file.
	*/
	svelte.configs.recommended,
	vue.configs['flat/recommended'],
	{
		...react.configs.flat.recommended,
		files: ['**/*.{jsx,tsx}'],
		/*
			An explicit version, NOT 'detect'.

			'detect' makes the plugin locate React on disk via
			`context.getFilename()` — an API ESLint 10 removed. eslint-plugin-react
			7.x predates ESLint 10, so detection throws
			`TypeError: contextOrFilename.getFilename is not a function` before any
			rule runs. Naming the version skips that path entirely.
		*/
		settings: { react: { version: '19.0' } }
	},
	// The automatic JSX runtime (`"jsx": "react-jsx"`), so no `import React`.
	{ ...react.configs.flat['jsx-runtime'], files: ['**/*.{jsx,tsx}'] },

	/*
		MUST come after every framework config: it disables the stylistic rules
		that would disagree with Prettier. Placed earlier, the framework configs
		re-enable them and you get lint errors that `prettier --write`
		immediately re-introduces.

		svelte.configs.prettier is a second, Svelte-specific disabler and has to
		follow the generic one.
	*/
	prettier,
	svelte.configs.prettier,

	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			/*
				typescript-eslint recommends turning this off on TypeScript
				projects: tsc already reports undefined identifiers, and the ESLint
				rule cannot see ambient or generated declarations, so it produces
				false positives on both.
			*/
			'no-undef': 'off'
		}
	},

	/*
		WITHOUT THIS BLOCK, LINTING ANY .svelte FILE CRASHES.

		svelte-eslint-parser handles the markup, but it needs to be told which
		parser to hand `<script lang="ts">` to. Left unset, the script is parsed
		by espree, and the typescript-eslint rules above then run against an AST
		carrying none of their visitor keys or parser services.

		The failure is `TypeError: getVisitorKeys is not a function or its return
		value is not iterable`, reported against the .svelte file — which points
		at the component rather than at the missing configuration.
	*/
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},

	// The same arrangement for Vue, for the same reason.
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.vue'],
				parser: ts.parser
			}
		},
		rules: {
			/*
				A component library names components after what they are: Button,
				matching Svelte and React. The collision this rule guards against
				is handled at registration instead — the plugin installs `PButton`.
			*/
			'vue/multi-word-component-names': 'off'
		}
	}
);
