/**
 * Flattens a nested array to a specified depth (default: all levels).
 *
 * @template T - The leaf element type
 * @param array - The nested array to flatten
 * @param depth - How many levels deep to flatten (default: `Infinity`)
 * @returns Flattened array of `T`
 *
 * @example
 * ```typescript
 * ArrayFlatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
 * ArrayFlatten([1, [2, [3]]], 1);   // [1, 2, [3]]
 * ```
 */
export function ArrayFlatten<T = unknown>(array: any[], depth?: number): T[] {
	if (!array) return [];
	return array.flat(depth ?? Infinity) as T[];
}
