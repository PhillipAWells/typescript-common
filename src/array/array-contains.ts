import type { TPredicate } from './types';

/**
 * Checks if an array contains at least one element that passes a predicate test.
 *
 * @template T - The type of array elements
 * @param array - The array to check
 * @param predicate - A function that tests each element; returns `true` to signal a match
 * @returns `true` if at least one element passes the test, `false` otherwise
 *
 * @example
 * ```typescript
 * ArrayContains([1, 2, 3], (n) => n > 2);   // true
 * ArrayContains([1, 2, 3], (n) => n > 10);  // false
 * ```
 */
export function ArrayContains<T>(array: T[], predicate: TPredicate<T>): boolean {
	if (!array || array.length === 0) {
		return false;
	}

	return array.some(predicate);
}
