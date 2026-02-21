import type { TTransform } from './types';

/**
 * Counts how many elements fall into each group defined by `keyFn`.
 *
 * @template T - The type of array elements
 * @template K - The key type (string, number, or symbol)
 * @param array - The array to count
 * @param keyFn - Function that assigns each element to a group key
 * @returns A record where keys are group identifiers and values are occurrence counts
 *
 * @example
 * ```typescript
 * ArrayCountBy(['one', 'two', 'three'], (s) => s.length);
 * // { 3: 2, 5: 1 }
 *
 * ArrayCountBy(users, (u) => u.role);
 * // { admin: 3, member: 12, guest: 1 }
 * ```
 */
export function ArrayCountBy<T, K extends string | number | symbol>(
	array: T[],
	keyFn: TTransform<T, K>,
): Record<K, number> {
	if (!array) return {} as Record<K, number>;

	const result = {} as Record<K, number>;

	for (const item of array) {
		const key = keyFn(item);
		result[key] = ((result[key] as number | undefined) ?? 0) + 1;
	}

	return result;
}
