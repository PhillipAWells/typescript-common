import type { TEqualityComparator } from './types';

/**
 * Returns elements present in the first array but not in the second (set difference).
 * Optimised O(n+m) using a Set when no custom comparator is provided.
 *
 * @template T - The type of array elements
 * @param array1 - The source array
 * @param array2 - Elements to exclude
 * @param comparator - Optional custom equality comparator
 * @returns Array of elements in `array1` that are not in `array2`
 *
 * @example
 * ```typescript
 * ArrayDifference([1, 2, 3, 4], [2, 4]); // [1, 3]
 * ArrayDifference(
 *   [{ id: 1 }, { id: 2 }],
 *   [{ id: 2 }],
 *   (a, b) => a.id === b.id,
 * ); // [{ id: 1 }]
 * ```
 *
 * @complexity O(n+m) for primitive values, O(n*m) when a comparator is provided
 */
export function ArrayDifference<T>(
	array1: T[],
	array2: T[],
	comparator?: TEqualityComparator<T>,
): T[] {
	if (!array1) return [];
	if (!array2 || array2.length === 0) return [...array1];

	if (comparator) {
		return array1.filter((item) => !array2.some((other) => comparator(item, other)));
	}

	const set2 = new Set(array2);
	return array1.filter((item) => !set2.has(item));
}
