import type { TTransform } from './types';

/**
 * Returns a new array sorted by the value produced by `keyFn`, without mutating the original.
 *
 * @template T - The type of array elements
 * @param array - The array to sort
 * @param keyFn - Function that extracts the sort key from each element
 * @param direction - Sort direction: `'asc'` (default) or `'desc'`
 * @returns A sorted copy of the array
 *
 * @example
 * ```typescript
 * ArraySortBy([{ name: 'Charlie' }, { name: 'Alice' }], (u) => u.name);
 * // [{ name: 'Alice' }, { name: 'Charlie' }]
 *
 * ArraySortBy([3, 1, 2], (n) => n, 'desc'); // [3, 2, 1]
 * ```
 */
export function ArraySortBy<T>(
	array: T[],
	keyFn: TTransform<T, string | number>,
	direction: 'asc' | 'desc' = 'asc',
): T[] {
	if (!array) return [];

	return [...array].sort((a, b) => {
		const keyA = keyFn(a);
		const keyB = keyFn(b);

		if (keyA < keyB) return direction === 'asc' ? -1 : 1;
		if (keyA > keyB) return direction === 'asc' ? 1 : -1;
		return 0;
	});
}
