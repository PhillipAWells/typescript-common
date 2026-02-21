# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

`@pawells/typescript-common` is a shared TypeScript utility library published to npm. It targets ES2022, is distributed as ESM, and has no runtime dependencies. The library currently exports from a single entry point (`src/index.ts`).

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

This is a minimal library package. All source lives under `src/` and is compiled to `./build/` by `tsc`.

**Entry point** (`src/index.ts`): The single public export surface for the library. All utilities, helpers, and types intended for consumers should be re-exported from this file.

## Key Patterns

**Adding exports**: Implement new utilities in `src/` and re-export them from `src/index.ts`.

**No runtime dependencies**: Keep `dependencies` empty. All tooling belongs in `devDependencies`.

**ESM only**: The package is `"type": "module"`. Use ESM import/export syntax throughout; avoid CommonJS patterns.

## TypeScript Configuration

Requires Node.js 24. Outputs to `./build/`, targets ES2022, module resolution `bundler`. Declaration files (`.d.ts`) and source maps are emitted alongside JS. Strict mode is fully enabled (`strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`).

## CI/CD

Single workflow (`.github/workflows/ci.yml`) triggered on push to `main`, PRs to `main`, and `v*` tags:
- **Push to `main` / PR**: typecheck → lint → test → build
- **Push `v*` tag**: typecheck → lint → test → build → publish to npm (with provenance) → create GitHub Release
