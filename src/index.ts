/**
 * @packageDocumentation
 *
 * `@pawells/typescript-common` — a shared TypeScript utility library targeting ES2022.
 *
 * All modules are exported as namespaces (e.g. `ArrayUtils`, `ObjectUtils`) as
 * well as individually for tree-shaking convenience.  There are no runtime
 * dependencies; every export is a pure function, type, or class.
 *
 * @example
 * ```typescript
 * // Namespace import
 * import { ArrayUtils, ObjectUtils } from '@pawells/typescript-common';
 * ArrayUtils.ArrayChunk([1, 2, 3, 4], 2); // [[1,2],[3,4]]
 *
 * // Direct named import
 * import { ArrayChunk, ObjectPick } from '@pawells/typescript-common';
 * ```
 */

// Array utilities
export * as ArrayUtils from './array/index.js';

// Object utilities
export * as ObjectUtils from './object/index.js';

// Asserts utilities
export * as AssertsUtils from './asserts/index.js';

// Boolean utilities
export * as BooleanUtils from './boolean/index.js';

// Number utilities
export * as NumberUtils from './number/index.js';

// String utilities
export * as StringUtils from './string/index.js';

// Time utilities
export * as TimeUtils from './time/index.js';

// Enum utilities
export * as EnumUtils from './enum/index.js';

// Function utilities
export * as FunctionUtils from './function/index.js';

// Direct exports for commonly used functions
export {
	// Array utilities
	ArrayFilter,
	ArrayContains,
	Unique,
	ArrayIntersection,
	ArrayChunk,
	ArrayShuffle,
	ArrayGroupBy,
	ArrayDifference,
	ArrayFlatten,
	ArrayCompact,
	ArrayPartition,
	ArrayZip,
	ArrayRange,
	ArraySortBy,
	ArrayCountBy,
	ArraySample,
} from './array/index.js';

export {
	// String utilities
	CamelCase,
	PASCAL_CASE,
	KEBAB_CASE,
	SNAKE_CASE,
	SCREAMING_SNAKE_CASE,
	FormatString,
	EscapeHTML,
	StripHTML,
	Pluralize,
	WordCount,
	CountOccurrences,
} from './string/index.js';

export {
	// Object utilities
	AssertObject,
	ObjectClone,
	TransformObject,
	ObjectEquals,
	ObjectFilter,
	FilterObject,
	ObjectPick,
	ObjectOmit,
	ObjectMerge,
	MapObject,
	ObjectHash,
	ObjectSortKeys,
	ObjectFromKeyValuePairs,
	ObjectToKeyValuePairs,
	ObjectGetPropertyByPath,
	ObjectSetPropertyByPath,
	ObjectInvert,
	ObjectFlatten,
	ObjectDiff,
} from './object/index.js';

export {
	// Time utilities
	ElapsedTime,
	Stopwatch,
} from './time/index.js';

export {
	// Enum utilities
	EnumKeys,
	EnumValues,
	EnumEntries,
	ValidateEnumValue,
	EnumKeyByValue,
	EnumSafeValue,
} from './enum/index.js';

export {
	// Function utilities
	Debounce,
	Throttle,
	Memoize,
	Once,
	Compose,
	Pipe,
	Sleep,
} from './function/index.js';

export {
	// Asserts utilities
	// (AssertObject is omitted here — it conflicts with ObjectUtils.AssertObject; use AssertsUtils.AssertObject instead)
	AssertArray,
	AssertArray2D,
	AssertArrayAll,
	AssertArrayAny,
	AssertArrayNotEmpty,
	AssertBoolean,
	AssertEquals,
	AssertExtends,
	AssertFunction,
	AssertInstanceOf,
	AssertIsType,
	AssertNotEquals,
	AssertNotNull,
	AssertNull,
	AssertNumber,
	AssertObjectHasOwnProperty,
	AssertObjectHasProperty,
	AssertObjectPropertyNotNull,
	AssertPredicate,
	AssertString,
	AssertStringMatches,
	AssertStringNotEmpty,
	AssertSymbol,
	SetExceptionClass,
	SetExceptionMessage,
	ThrowException,
	// Error classes
	AssertionError,
	BaseError,
	BufferOverflowError,
	InvalidArgumentError,
	NotFoundError,
	NotSupportedError,
	ValidationError,
	ArrayError,
	BooleanError,
	ExtendsError,
	FunctionError,
	InstanceOfError,
	NotNullError,
	NullError,
	NumberError,
	NumberRangeError,
	ObjectError,
	ObjectPropertyError,
	PredicateError,
	StringError,
	SymbolError,
	TypeGuardError,
} from './asserts/index.js';
