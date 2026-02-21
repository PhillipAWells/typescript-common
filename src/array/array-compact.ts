/**
 * Removes `null` and `undefined` values from an array, narrowing the element type.
 *
 * @template T - The non-nullish element type
 * @param array - The array to compact
 * @returns A new array with `null`/`undefined` entries removed
 *
 * @example
 * ```typescript
 * ArrayCompact([1, null, 2, undefined, 3]); // [1, 2, 3]
 * // Return type is narrowed: number[]
 *
 * const names: (string | null)[] = ['Alice', null, 'Bob'];
 * const clean: string[] = ArrayCompact(names);
 * ```
 */
export function ArrayCompact<T>(array: (T | null | undefined)[]): T[] {
	if (!array) return [];
	return array.filter((item): item is T => item !== null && item !== undefined);
}
