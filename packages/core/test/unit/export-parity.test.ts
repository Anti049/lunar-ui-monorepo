import { expect, test } from 'bun:test';

/*
	The three binding packages must export the same component set. Nothing else
	enforces this: each package builds independently and passes its own checks
	while quietly missing a component the other two have.

	It lives in `packages/core` because that is the one package that can import
	all three without creating a dependency cycle.

	It requires all three to be BUILT — it imports from dist/, not src/, so that
	it tests what consumers actually receive. Run it in CI after
	`bun run build:packages`, never in a watch loop.
*/
test('every binding exports the same component set', async () => {
	const [svelte, react, vue] = await Promise.all([
		import('../../svelte/dist/index.js'),
		import('../../react/dist/index.js'),
		import('../../vue/dist/index.js')
	]);

	/*
		Components only. An initial capital is the convention in all three
		frameworks, which conveniently excludes `cn`, `ripple` and the hooks —
		those are allowed to differ, because each framework has its own idiom.
	*/
	const names = (module: object): string[] =>
		Object.keys(module)
			.filter((key) => /^[A-Z]/.test(key))
			.sort();

	// Svelte is the reference simply because it was written first. The
	// assertion is symmetric; which one is the baseline does not matter.
	expect(names(react)).toEqual(names(svelte));
	expect(names(vue)).toEqual(names(svelte));
});
