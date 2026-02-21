import type { TEqualityComparator } from './types';

/**
 * Returns the intersection of two arrays (elements present in both)
 * Optimized O(n+m) complexity using Set-based approach
 *
 * @template T - The type of array elements
 * @param array1 - First array
 * @param array2 - Second array
 * @param comparator - Optional custom equality comparator
 * @returns Array containing elements present in both arrays
 *
 * @example
 * ```typescript
 * ArrayIntersection([1, 2, 3], [2, 3, 4]); // [2, 3]
 * ArrayIntersection(
 *   [{id: 1}, {id: 2}],
 *   [{id: 2}, {id: 3}],
 *   (a, b) => a.id === b.id
 * ); // [{id: 2}]
 * ```
 *
 * @complexity O(n+m) where n and m are array lengths
 */
export function ArrayIntersection<T>(
	array1: T[],
	array2: T[],
	comparator?: TEqualityComparator<T>,
): T[] {
	if (!array1 || !array2) {
		return [];
	}

	// If no custom comparator, use Set for O(n+m) performance
	if (!comparator) {
		const set2 = new Set(array2);
		return array1.filter(item => set2.has(item));
	}

	// With custom comparator, still optimize by checking smaller array
	// This reduces comparisons from n*m to min(n,m)*max(n,m)
	const [smaller, larger] = array1.length <= array2.length
		? [array1, array2]
		: [array2, array1];

	return smaller.filter(item =>
		larger.some(otherItem => comparator(item, otherItem)),
	);
}
