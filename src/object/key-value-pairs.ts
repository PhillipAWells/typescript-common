/**
 * Creates an object from an array of key-value pairs
 * @param entries Array of [key, value] tuples
 * @returns Object with keys and values from the entries
 */
export function ObjectFromKeyValuePairs<T = unknown>(entries: [string, T][]): Record<string, T> {
	return entries.reduce((obj, [key, value]) => {
		obj[key] = value;
		return obj;
	}, {} as Record<string, T>);
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
