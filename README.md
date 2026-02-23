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
import {
  ArrayUtils, BooleanUtils, NumberUtils,
  ObjectUtils, StringUtils, TimeUtils,
  EnumUtils, FunctionUtils, AssertsUtils,
} from '@pawells/typescript-common';

ArrayUtils.ArrayChunk([1, 2, 3, 4], 2); // [[1, 2], [3, 4]]
ArrayUtils.AssertArray(value);           // throws if not an array
BooleanUtils.AssertBoolean(value);       // throws if not a boolean
NumberUtils.AssertNumber(value, { gte: 0, integer: true });

// Direct named import (tree-shakeable)
import { ArrayChunk, ObjectPick, CamelCase, Sleep, AssertString } from '@pawells/typescript-common';
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
| `AssertArray(value, args?, exception?)` | Assert value is an array (with optional size constraints) |
| `AssertArray2D(value, args?, exception?)` | Assert value is a rectangular 2D array |
| `AssertArrayNotEmpty(value, exception?)` | Assert array has at least one element |
| `AssertArrayAll(array, predicate, exception?)` | Assert every element satisfies a predicate |
| `AssertArrayAny(array, predicate, exception?)` | Assert at least one element satisfies a predicate |

### Boolean utilities — `BooleanUtils`

| Export | Description |
|--------|-------------|
| `AssertBoolean(value, exception?)` | Assert value is a boolean primitive |

### Number utilities — `NumberUtils`

| Export | Description |
|--------|-------------|
| `AssertNumber(value, args?, exception?)` | Assert value is a number with optional range/type constraints (`finite`, `integer`, `gt`, `gte`, `lt`, `lte`, `eq`) |

### Object utilities — `ObjectUtils`

| Export | Description |
|--------|-------------|
| `AssertObject(value)` | Assert a value is a non-null plain object (type-guard, returns boolean) |
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
| `AssertObjectHasProperty(value, property, exception?)` | Assert object has an inherited or own property |
| `AssertObjectHasOwnProperty(value, property, exception?)` | Assert object has a direct own property |
| `AssertObjectPropertyNotNull(value, property, exception?)` | Assert object property is not null/undefined |

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
| `AssertString(value, exception?)` | Assert value is a string primitive |
| `AssertStringNotEmpty(value, exception?)` | Assert value is a non-empty, non-whitespace string |
| `AssertStringMatches(value, regex, exception?)` | Assert string matches a regular expression |

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

### Assertion utilities — `AssertsUtils`

Cross-cutting assertions not tied to a single type, plus the shared assertion infrastructure.

| Export | Description |
|--------|-------------|
| `AssertEquals(value, expected, exception?)` | Assert two values are deeply equal |
| `AssertNotEquals(value, expected, exception?)` | Assert two values are not deeply equal |
| `AssertNull(value, exception?)` | Assert value is `null` or `undefined` |
| `AssertNotNull(value, exception?)` | Assert value is neither `null` nor `undefined` |
| `AssertPredicate(value, predicate, exception?)` | Assert a custom predicate holds |
| `AssertIsType(value, typeGuard, exception?)` | Assert via a type-guard function |
| `AssertInstanceOf(value, constructor, exception?)` | Assert value is an instance of a constructor |
| `AssertFunction(value, exception?)` | Assert value is a function |
| `AssertSymbol(value, exception?)` | Assert value is a symbol |
| `AssertExtends(derived, base, exception?)` | Assert one class extends another |
| `ThrowException(exception)` | Throw using an `IAssertException` config object |
| `SetExceptionClass(exception, class, force?)` | Configure the error class for an assertion |
| `SetExceptionMessage(exception, message, force?)` | Configure the error message for an assertion |

**All type-specific assertions** (`AssertArray`, `AssertBoolean`, `AssertNumber`, `AssertObject` (throwing), `AssertString`, etc.) are also accessible through `AssertsUtils` as a single convenience namespace.

**Note:** `AssertsUtils.AssertObject` is the throwing assertion (narrows to `Record<string, unknown>`). `ObjectUtils.AssertObject` is the boolean predicate (returns `true`/`false`).

#### Error classes

`BaseError`, `ValidationError`, `AssertionError`, `InvalidArgumentError`, `NotFoundError`, `NotSupportedError`, `BufferOverflowError`, `ArrayError`, `BooleanError`, `NumberError`, `NumberRangeError`, `ObjectError`, `ObjectPropertyError`, `StringError`, `NullError`, `NotNullError`, `PredicateError`, `TypeGuardError`, `InstanceOfError`, `FunctionError`, `SymbolError`, `ExtendsError`.

## Development

```bash
yarn install        # Install dependencies
yarn build          # Compile TypeScript (tsconfig.build.json) → ./build/
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
