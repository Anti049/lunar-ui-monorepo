# Contributing

## Setup

    bun install
    bun run --filter '@anti049/lunar-ui' build   # generated/ must exist first
    bun run check

    git config commit.template .gitmessage

## Commits

Conventional Commits, enforced by a hook and again in CI.
Scopes: `core`, `svelte`, `react`, `vue`, `docs`, `repo`, `deps`.

## Every PR needs a changeset

    bun changeset

…unless it genuinely ships nothing to a consumer, in which case label it
`skip-changeset`.

## What counts as breaking

The CSS class names and tokens are public API. Treat as breaking:

- renaming or removing any emitted class
- renaming a `--theme-color-*` or shape token
- changing an `@plugin` option name, or rejecting one that used to be ignored
- changing a cascade layer's depth or name — it changes what overrides what
- narrowing a peer dependency range
- removing an `exports` subpath

Not breaking: adding a class, a token or an option; changing a build script;
anything inside `generated/`.
