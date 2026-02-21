# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

`@pawells/typescript-common` is a shared TypeScript utility library published to npm. It targets ES2022, is distributed as ESM, and has no runtime dependencies. The library exports from a single entry point (`src/index.ts`).

## Commands

```bash
yarn build            # Compile TypeScript → ./build/
yarn dev              # Build and run (tsc && node build/index.js)
yarn watch            # TypeScript watch mode
yarn typecheck        # Type check without emitting
yarn lint             # ESLint src/
yarn lint:fix         # ESLint with auto-fix
yarn test             # Run Vitest tests
yarn test:ui          # Open interactive Vitest UI in a browser
yarn test:coverage    # Run tests with coverage report
yarn start            # Run built output
```

To run a single test file: `yarn vitest run src/path/to/file.test.ts`

## Architecture

All source lives under `src/` and is compiled to `./build/` by `tsc`.

**Entry point** (`src/index.ts`): The single public export surface for the library. All utilities, helpers, and types intended for consumers must be re-exported from this file — both as namespace exports (e.g. `export * as ArrayUtils from './array/index.js'`) and as individual named exports for tree-shaking.

### Module directories

Each type domain has its own directory under `src/` with a barrel `index.ts`:

| Directory | Namespace | Contents |
|-----------|-----------|----------|
| `src/array/` | `ArrayUtils` | Array helpers + array assertions (`assert.ts`) |
| `src/boolean/` | `BooleanUtils` | Boolean assertions (`assert.ts`) |
| `src/enum/` | `EnumUtils` | Enum introspection helpers |
| `src/function/` | `FunctionUtils` | Higher-order function helpers |
| `src/number/` | `NumberUtils` | Numeric assertions (`assert.ts`) |
| `src/object/` | `ObjectUtils` | Object helpers + object assertions (`assert.ts`) |
| `src/string/` | `StringUtils` | String helpers + string assertions (`assert.ts`) |
| `src/time/` | `TimeUtils` | Stopwatch / elapsed-time helpers |
| `src/asserts/` | `AssertsUtils` | Cross-cutting assertion infrastructure: generic asserts, shared types (`types.ts`), throwing utilities (`utils.ts`), base error classes (`errors.ts`), and internal helpers (`internal-utils.ts`). **Does not contain type-specific assertions** — those live in the module directories above. |

### Assertions layout

Type-specific assertion files (named `assert.ts`) live **inside their domain module directory** and are co-exported from that module's `index.ts`. `src/asserts/index.ts` re-exports everything so `AssertsUtils` remains a single convenience namespace covering all assertions.

The shared assertion plumbing (`IAssertException`, `ThrowException`, `SetExceptionClass`, `SetExceptionMessage`) lives in `src/asserts/types.ts` and `src/asserts/utils.ts`. Type-specific `assert.ts` files import from `../asserts/types.js` and `../asserts/utils.js`.

## Key Patterns

**Adding a type-specific assertion**: implement it in `src/<module>/assert.ts`, ensure it's exported from `src/<module>/index.ts`, and add it to the named exports block in `src/index.ts`.

**Adding a generic assertion**: implement it in `src/asserts/generic.ts` and export from `src/asserts/index.ts`.

**Adding other utilities**: implement in `src/<module>/`, export from the module's `index.ts`, and re-export from `src/index.ts`.

**No runtime dependencies**: Keep `dependencies` empty. All tooling belongs in `devDependencies`.

**ESM only**: The package is `"type": "module"`. Use ESM import/export syntax throughout; avoid CommonJS patterns. Internal imports must use `.js` extensions.

## TypeScript Configuration

Requires Node.js 24. Outputs to `./build/`, targets ES2022, module resolution `bundler`. Declaration files (`.d.ts`) and source maps are emitted alongside JS. Strict mode is fully enabled (`strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`).

## CI/CD

Single workflow (`.github/workflows/ci.yml`) triggered on push to `main`, PRs to `main`, and `v*` tags:
- **Push to `main` / PR**: typecheck → lint → test → build
- **Push `v*` tag**: typecheck → lint → test → build → publish to npm (with provenance) → create GitHub Release
