# Contributing

## Development and tests

Requires Node.js >= 22. This repository uses Yarn 4 with Plug'n'Play (PnP) and
zero-installs, following `wasabi-api-node`. Runtime code has no external
dependencies; TypeScript is a development dependency used to validate the bundled
declarations.

Enable Corepack once if the Yarn command is not available:

```sh
corepack enable
yarn test
```

`yarn test` runs the runtime tests in `test/*.test.js` and strict TypeScript consumer
checks with both NodeNext and bundler module resolution. Tests use mocked fetch
responses and temporary localhost HTTP servers; no Electrum daemon or funds are
needed. The HTTP tests require permission to bind localhost ports.

```sh
yarn node --test "test/*.test.js"
yarn test:types
npm pack --dry-run
```

The checked-in `yarn.lock`, `.yarn/cache/`, `.pnp.cjs`, and `.pnp.loader.mjs`
allow a fresh checkout to run tests without installing dependencies or accessing
the registry. Yarn itself must be available; Corepack uses the version pinned in
`package.json` (`yarn@4.18.0`). Corepack may need network access the first time it
downloads that Yarn version.

To verify the local zero-install artifacts without changing them:

```sh
yarn install --immutable --immutable-cache
```

CI also uses `--check-cache` to refetch dependencies and verify the checked-in
cache against the lockfile. This CI integrity check requires registry access.

When changing dependencies, run `yarn install` and include the updated lockfile,
local cache archives, and both PnP loaders in the change. `.yarn/install-state.gz`
is a local optimization and remains ignored. Do not create a `package-lock.json`
or install repository dependencies with npm.

Yarn enables the PnP loaders automatically. To run Node directly, enable both
loaders explicitly:

```sh
node --require ./.pnp.cjs --loader ./.pnp.loader.mjs --test "test/*.test.js"
```

Use the explicit `test/*.test.js` pattern so Node does not execute the compile-only
TypeScript fixtures. Plain `node --test` and `npm test` do not enable the PnP
loaders; use the Yarn commands above. `npm pack --dry-run` remains useful for
checking the published npm package, which contains only runtime source,
declarations, and documentation.

## RPC coverage

Before adding or updating wrappers, inspect the official `electrum/commands.py`
decorators and the daemon's endpoint registration. Check the command decorator's
`wallet_path` handling as well as each Python signature. Keep wrappers as direct
parameter-name mappings that call the shared `request()` transport.

The source revision, complete command table and coverage update instructions are
in [docs/rpc-methods.md](./docs/rpc-methods.md). Coverage tests check all registered
core endpoints and aliases against the inspected-source fixture. Update the
fixture, wrapper, declaration and documentation together when the API changes.

No tests broadcast transactions or modify a real wallet. Unit and local HTTP
tests do not replace checking behavior against your deployed Electrum version.
