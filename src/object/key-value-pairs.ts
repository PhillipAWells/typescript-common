/**
 * Creates an object from an array of key-value pair tuples.
 * The inverse of {@link ObjectToKeyValuePairs}.
 *
 * @template T - The value type
 * @param entries - Array of `[key, value]` tuples
 * @returns Object whose keys and values come from `entries`
 *
 * @example
 * ```typescript
 * ObjectFromKeyValuePairs([['a', 1], ['b', 2]]); // { a: 1, b: 2 }
 * ```
 */
export function ObjectFromKeyValuePairs<T = unknown>(entries: readonly [string, T][]): Record<string, T> {
	const obj = {} as Record<string, T>;
	for (const [key, value] of entries) {
		// Use defineProperty to bypass inherited setters (e.g. __proto__) and
		// prevent prototype pollution.
		Object.defineProperty(obj, key, {
			value,
			writable: true,
			enumerable: true,
			configurable: true,
		});
	}
	return obj;
}

/**
 * Converts an object into an array of `[key, value]` tuples.
 * The inverse of {@link ObjectFromKeyValuePairs}.
 *
 * @template T - The value type
 * @param obj - The object to convert
 * @returns An array of `[key, value]` pairs
 *
 * @example
 * ```typescript
 * ObjectToKeyValuePairs({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]
 * ```
 */
export function ObjectToKeyValuePairs<T = unknown>(obj: Record<string, T>): [string, T][] {
	return Object.entries(obj) as [string, T][];
}
