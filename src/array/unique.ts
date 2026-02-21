/**
 * Returns a new array with duplicate values removed.
 *
 * @template T - The type of array elements
 * @param array - The input array
 * @returns A new array containing only unique values (preserves first occurrence order)
 *
 * @remarks Uses reference equality for objects. Two distinct objects with
 * identical property values are **not** considered equal and will both be kept.
 *
 * @example
 * ```typescript
 * Unique([1, 2, 2, 3, 1]); // [1, 2, 3]
 * Unique(['a', 'b', 'a']); // ['a', 'b']
 * ```
 */
export function Unique<T>(array: T[]): T[] {
	if (!array) {
		return [];
	}

	return [...new Set(array)];
}
