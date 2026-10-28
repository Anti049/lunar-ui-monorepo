/*
	Prerender everything. `adapter-static` with `strict: true` refuses to build
	any route that is not prerenderable, and a route is not prerenderable unless
	something opts it in — this is that opt-in, inherited by every route below.

	Without this file the build fails with "The following routes were marked as
	prerenderable, but were not prerendered", naming every page you have.
*/
export const prerender = true;

/*
	No server, so no server-side rendering per request. SSR still happens at
	BUILD time to produce the HTML; this only disables the runtime kind, which
	Pages cannot do anyway.
*/
export const ssr = true;
