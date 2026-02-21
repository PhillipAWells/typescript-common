/**
 * A constructor function type for creating objects of type O.
 * @template O The object type to construct.
 */

export type TConstructableObject<O extends object = object> = new (...args: any[]) => O;
/**
 * Omits properties from B that are not in A.
 * @template A Base type.
 * @template B Type to filter.
 */
export type TObjectOmitExtraProperties<A, B> = {
	[K in keyof B]: K extends A ? B[K] : never;
};
/**
 * Extracts the property keys of an object type.
 * @template O The object type.
 */
export type TObjectProperties<O extends object> = keyof O;
/**
 * Extracts property keys of a specific type from an object.
 * @template O Object type.
 * @template PropertyType The type to match.
 */
export type TObjectPropertiesOfType<O extends object, PropertyType> = keyof {
	[K in keyof O as O[K] extends PropertyType ? K : never]: any
};
/**
 * Omits properties of a specific type from an object.
 * @template O Object type.
 * @template PropertyType The type to omit.
 */
export type TObjectOmitPropertiesOfType<O extends object, PropertyType> = {
	[K in keyof O as O[K] extends PropertyType ? never : K]: O[K];
};
/**
 * Represents the union of all property values in an object.
 * @template T Object type.
 */
export type TObjectPropertyType<T extends object> = T[keyof T];
/**
 * Extracts properties shared between two object types.
 * @template A First object type.
 * @template B Second object type.
 */
export type TObjectSharedProperties<A extends object, B extends object> = {
	[K in keyof A & keyof B]: K extends keyof A ? A[K] : never;
};
/**
 * Extracts keys of array properties from an object type.
 * @template T Object type.
 */
export type TObjectArrayProperties<T extends object> = {
	[K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

/**
 * Generates nested dot-notation keys for an object type.
 * @template ObjectType The object type.
 */
export type TObjectNestedKeyOf<ObjectType extends object> = { [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object ? `${Key}` | `${Key}.${TObjectNestedKeyOf<ObjectType[Key]>}` : `${Key}` }[keyof ObjectType & (string | number)];

/**
 * Options for object filtering behavior.
 */
export interface IObjectFilterOptions {
	/** When `true`, uses deep equality for nested object comparisons instead of strict reference equality. Default: `false`. */
	useDeepEqual?: boolean | undefined;
	/** When `true`, string comparisons are case-insensitive. Default: `false`. */
	caseInsensitiveStrings?: boolean | undefined;
	/** When `true`, validates dot-notation property paths against prototype-pollution patterns. Default: `false`. */
	validatePaths?: boolean | undefined;
}

/**
 * Options for cached object filtering behavior.
 */
export interface ICachedObjectFilterOptions {
	/** Maximum number of unique (filter, object) result pairs to store in the cache. Default: `1000`. */
	maxCacheSize?: number | undefined;
	/** When `true`, uses deep equality for nested object comparisons instead of strict reference equality. Default: `false`. */
	useDeepEqual?: boolean | undefined;
	/** When `true`, string comparisons are case-insensitive. Default: `false`. */
	caseInsensitiveStrings?: boolean | undefined;
	/** When `true`, validates dot-notation property paths against prototype-pollution patterns. Default: `false`. */
	validatePaths?: boolean | undefined;
}

/**
 * Options for cached object mapping behavior.
 */
export interface ICachedObjectMapOptions {
	/** Maximum number of cached mapping results to retain per mapper key. Default: `1000`. */
	maxCacheSize?: number | undefined;
}

/**
 * Type for cached object filter functions.
 * @template T The object type being filtered.
 */
export type TCachedObjectFilterFunction<T extends object> = (cursor: T, filter: Partial<Record<string, any>>) => Promise<boolean>;

/**
 * Type for cached object map functions.
 * @template T The object type being mapped.
 */
export type TCachedObjectMapperFunction<T extends object> = (cursor: T, mapper: TPropertyMapper<T>, mapperKey?: string) => Promise<Record<keyof T, unknown>>;

/**
 * Object predicate function type for filtering and validation
 * @template T - The type of object being tested
 * @param obj - The object to test
 * @returns true if the object passes the predicate, false otherwise
 */
export type TObjectPredicate<T extends object = object> = (obj: T) => boolean;

/**
 * Object transformer function type for mapping operations
 * @template TInput - The input object type
 * @template TOutput - The output object type
 * @param input - The object to transform
 * @returns The transformed object
 */
export type TObjectTransformer<TInput extends object = object, TOutput extends object = object> = (
	input: TInput,
) => TOutput;

/**
 * Object comparator function type for sorting and comparison
 * @template T - The type of objects being compared
 * @param a - First object
 * @param b - Second object
 * @returns Negative if a < b, zero if a === b, positive if a > b
 */
export type TObjectComparator<T extends object = object> = (a: T, b: T) => number;

/**
 * Object equality comparator function type
 * @template T - The type of objects being compared
 * @param a - First object
 * @param b - Second object
 * @returns true if objects are equal, false otherwise
 */
export type TObjectEqualityComparator<T extends object = object> = (a: T, b: T) => boolean;

/**
 * Property mapper function type
 * @template T - The object type
 * @template K - The property key type
 * @param key - The property key
 * @param value - The property value
 * @returns The mapped value
 */
export type TPropertyMapper<T extends object = object, K extends keyof T = keyof T> = (
	key: K,
	value: T[K],
) => unknown;

/**
 * Property filter predicate type
 * @template T - The object type
 * @template K - The property key type
 * @param key - The property key
 * @param value - The property value
 * @returns true to include the property, false to exclude
 */
export type TPropertyFilter<T extends object = object, K extends keyof T = keyof T> = (
	key: K,
	value: T[K],
) => boolean;
