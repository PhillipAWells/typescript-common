import type { TPredicate } from './types';

/**
 * Splits an array into two groups: elements that satisfy the predicate and those that do not.
 *
 * @template T - The type of array elements
 * @param array - The array to partition
 * @param predicate - The condition to test each element against
 * @returns A tuple `[matches, rest]` where `matches` passed the predicate
 *
 * @example
 * ```typescript
 * const [evens, odds] = ArrayPartition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
 * // evens → [2, 4], odds → [1, 3, 5]
 *
 * const [admins, users] = ArrayPartition(users, (u) => u.role === 'admin');
 * ```
 */
export function ArrayPartition<T>(array: T[], predicate: TPredicate<T>): [T[], T[]] {
	if (!array) return [[], []];

	const matches: T[] = [];
	const rest: T[] = [];

	for (const item of array) {
		if (predicate(item)) {
			matches.push(item);
		} else {
			rest.push(item);
		}
	}

	return [matches, rest];
}
