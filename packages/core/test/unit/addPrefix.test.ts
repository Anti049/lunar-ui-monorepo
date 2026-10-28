import { expect, test } from 'bun:test';
import { addPrefix } from '../../functions/addPrefix.js';
import type { StyleObject } from '../../types.js';

const registry = { classes: ['button', 'badge'], variables: ['button-color'] };

/*
	Annotated as StyleObject in BOTH directions, deliberately.

	addPrefix is generic — `<T extends StyleObject>(styles: T) => T` — so passing
	an object literal makes the return type that same literal, and `toEqual` then
	rejects the renamed keys with "Object literal may only specify known
	properties". StyleObject carries an index signature, so the renamed keys are
	assignable and the assertion compiles.
*/
const px = (styles: StyleObject): StyleObject => addPrefix(styles, 'px-', registry);

test('renames a class it owns', () => {
	expect(px({ '.button': { color: 'red' } })).toEqual({ '.px-button': { color: 'red' } });
});

test('leaves a class it does not own', () => {
	// `.disabled` is the consumer's state hook, not ours.
	expect(px({ '.button.disabled': {} })).toEqual({ '.px-button.disabled': {} });
});

test('does not rename inside an attribute value', () => {
	// The dot in 'x.button' is not a class.
	const out = px({ "[data-state='x.button']": {} });
	expect(Object.keys(out)[0]).toBe("[data-state='x.button']");
});

test('does not treat an escaped slash as a new class', () => {
	// Real compiled output contains `.w-1\/2`; naive matching sees `/2`.
	const out = px({ '.w-1\\/2 .button': {} });
	expect(Object.keys(out)[0]).toBe('.w-1\\/2 .px-button');
});

test('survives a comment containing an apostrophe', () => {
	// A regex-based prefixer opens a quote here that never closes, and every
	// class after it is silently skipped.
	const out = px({ "/* it's fine */ .button": {} });
	expect(Object.keys(out)[0]).toContain('.px-button');
});

test('renames a variable it owns, in both key and value', () => {
	expect(px({ '.button': { '--button-color': 'red', color: 'var(--button-color)' } })).toEqual({
		'.px-button': { '--px-button-color': 'red', color: 'var(--px-button-color)' }
	});
});

test('leaves Tailwind theme variables alone', () => {
	// Not in the registry, so not ours to rename.
	expect(px({ '.button': { color: 'var(--color-primary)' } })).toEqual({
		'.px-button': { color: 'var(--color-primary)' }
	});
});

test('renames the variable an @property registers', () => {
	// The one at-rule whose params are a variable name.
	const out = px({ '@property --button-color': { syntax: "'<color>'" } });
	expect(Object.keys(out)[0]).toBe('@property --px-button-color');
});

test('leaves other at-rules untouched', () => {
	const out = px({ '@media (width < 620px)': { '.button': {} } });
	expect(Object.keys(out)[0]).toBe('@media (width < 620px)');
	expect(Object.keys(out['@media (width < 620px)'] as StyleObject)[0]).toBe('.px-button');
});

test('an empty prefix returns the input unchanged', () => {
	// Identity, not a copy: addPrefix returns early so no object is allocated.
	const input: StyleObject = { '.button': { color: 'red' } };
	expect(addPrefix(input, '', registry)).toBe(input);
});
