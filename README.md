# TypeScript Common Utilities

[![npm](https://img.shields.io/npm/v/@pawells/typescript-common)](https://www.npmjs.com/package/@pawells/typescript-common)
[![GitHub Release](https://img.shields.io/github/v/release/PhillipAWells/typescript-common)](https://github.com/PhillipAWells/typescript-common/releases)
[![CI](https://github.com/PhillipAWells/typescript-common/actions/workflows/ci.yml/badge.svg)](https://github.com/PhillipAWells/typescript-common/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D24-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/PhillipAWells?style=social)](https://github.com/sponsors/PhillipAWells)

Shared TypeScript utility library. ESM-only, no runtime dependencies, targets ES2022.

## Installation

```bash
npm install @pawells/typescript-common
# or
yarn add @pawells/typescript-common
```

## Usage

All utilities are available as namespace imports or as individual named exports for tree-shaking.

```typescript
// Namespace import
import { ArrayUtils, ObjectUtils, StringUtils, TimeUtils, EnumUtils, FunctionUtils } from '@pawells/typescript-common';

ArrayUtils.ArrayChunk([1, 2, 3, 4], 2); // [[1, 2], [3, 4]]

// Direct named import (tree-shakeable)
import { ArrayChunk, ObjectPick, CamelCase, Sleep } from '@pawells/typescript-common';
```

## API

### Array utilities — `ArrayUtils`

| Export | Description |
|--------|-------------|
| `ArrayChunk(array, size)` | Split an array into chunks of a given size |
| `ArrayContains(array, predicate)` | Check if any element satisfies a predicate |
| `ArrayFilter(array, predicate)` | Type-safe array filter |
| `ArrayGroupBy(array, keyFn)` | Group array elements by a key function |
| `ArrayIntersection(a, b)` | Return elements present in both arrays |
| `ArrayShuffle(array)` | Return a shuffled copy of an array |
| `Unique(array)` | Remove duplicate values |
| `ArrayDifference(a, b)` | Elements in `a` not present in `b` |
| `ArrayFlatten(array, depth?)` | Flatten a nested array to a given depth |
| `ArrayCompact(array)` | Remove `null`/`undefined`, narrowing the type |
| `ArrayPartition(array, predicate)` | Split into `[matches, rest]` |
| `ArrayZip(...arrays)` | Zip multiple arrays into tuples |
| `ArrayRange(start, end, step?)` | Generate a numeric sequence |
| `ArraySortBy(array, keyFn, direction?)` | Immutable sort by a computed key |
| `ArrayCountBy(array, keyFn)` | Count elements per group key |
| `ArraySample(array, n?)` | Random element or `n` random elements |

### Object utilities — `ObjectUtils`

| Export | Description |
|--------|-------------|
| `AssertObject(value)` | Assert a value is a non-null object |
| `ObjectClone(obj)` | Deep-clone an object |
| `ObjectEquals(a, b)` | Deep equality check |
| `ObjectFilter(obj, predicate)` | Filter object entries by predicate |
| `FilterObject(obj, keys)` | Keep only specified keys |
| `ObjectPick(obj, keys)` | Pick a subset of keys |
| `ObjectOmit(obj, keys)` | Omit specified keys |
| `ObjectMerge(target, ...sources)` | Deep merge objects |
| `MapObject(obj, fn)` | Map over object values |
| `TransformObject(obj, fn)` | Transform object entries |
| `ObjectHash(obj)` | Compute a stable hash of an object |
| `ObjectSortKeys(obj)` | Return object with keys sorted |
| `ObjectFromKeyValuePairs(pairs)` | Build an object from `[key, value]` pairs |
| `ObjectToKeyValuePairs(obj)` | Convert an object to `[key, value]` pairs |
| `ObjectGetPropertyByPath(obj, path)` | Get a nested property by dot-path |
| `ObjectSetPropertyByPath(obj, path, value)` | Set a nested property by dot-path |
| `ObjectInvert(obj)` | Swap keys and values |
| `ObjectFlatten(obj, separator?)` | Flatten nested object to dot-separated keys |
| `ObjectDiff(objA, objB)` | Compute added/removed/changed keys between two objects |

### String utilities — `StringUtils`

| Export | Description |
|--------|-------------|
| `CamelCase(str)` | Convert a string to camelCase |
| `PASCAL_CASE(str)` | Convert a string to PascalCase |
| `KEBAB_CASE(str)` | Convert a string to kebab-case |
| `SNAKE_CASE(str)` | Convert a string to snake_case |
| `SCREAMING_SNAKE_CASE(str)` | Convert a string to SCREAMING_SNAKE_CASE |
| `FormatString(template, values)` | Simple string template formatting |
| `EscapeHTML(str)` | Escape HTML special characters |
| `StripHTML(str)` | Remove all HTML tags from a string |
| `Pluralize(word, count, plural?)` | Return singular or plural form based on count |
| `WordCount(str)` | Count the number of words in a string |
| `CountOccurrences(str, substr)` | Count non-overlapping occurrences of a substring |

### Time utilities — `TimeUtils`

| Export | Description |
|--------|-------------|
| `ElapsedTime` | Measure elapsed time with human-readable output |
| `Stopwatch` | Lap-based stopwatch for benchmarking |

### Enum utilities — `EnumUtils`

| Export | Description |
|--------|-------------|
| `EnumKeys(enumObj)` | Get keys of a TypeScript enum |
| `EnumValues(enumObj)` | Get values of a TypeScript enum |
| `EnumEntries(enumObj)` | Get key-value pairs of a TypeScript enum |
| `ValidateEnumValue(enumObj, value)` | Check if a value is a valid enum member |
| `EnumKeyByValue(enumObj, value)` | Look up an enum key by its value |
| `EnumSafeValue(enumObj, value)` | Return the value if valid, or `undefined` |

### Function utilities — `FunctionUtils`

| Export | Description |
|--------|-------------|
| `Debounce(fn, ms)` | Delay execution until `ms` ms after the last call |
| `Throttle(fn, ms)` | Limit execution to at most once per `ms` ms |
| `Memoize(fn, keyFn?)` | Cache results by serialised arguments |
| `Once(fn)` | Execute a function at most once, caching the result |
| `Pipe(...fns)` | Compose functions left-to-right |
| `Compose(...fns)` | Compose functions right-to-left |
| `Sleep(ms)` | Return a `Promise` that resolves after `ms` ms |

## Development

```bash
yarn install        # Install dependencies
yarn build          # Compile TypeScript → ./build/
yarn dev            # Build + run
yarn watch          # Watch mode
yarn typecheck      # Type check without building
yarn lint           # ESLint
yarn lint:fix       # ESLint with auto-fix
yarn test           # Run tests
yarn test:ui        # Interactive Vitest UI
yarn test:coverage  # Tests with coverage report
```

## Requirements

- Node.js >= 24.0.0

## License

MIT — See [LICENSE](./LICENSE) for details.
