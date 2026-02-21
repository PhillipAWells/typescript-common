import type { TPredicate } from './types';

/**
 * Checks if an array contains at least one element that passes a predicate test.
 * @param array The array to check.
 * @param predicate TPredicate function to test each element.
 * @returns True if at least one element passes the test, false otherwise.
 */
export function ArrayContains<T>(array: T[], predicate: TPredicate<T>): boolean {
	if (!array || array.length === 0) {
		return false;
	}

	return array.some(predicate);
}
