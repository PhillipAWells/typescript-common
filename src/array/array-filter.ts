import type { TPredicate } from './types';

/**
 * Gets nested property value from an object using dot notation
 * @param obj - The object to get value from
 * @param path - The property path (e.g., 'user.name')
 * @returns The value at the path, or undefined
 */
function getNestedValue(obj: unknown, path: string): unknown {
	const keys = path.split('.');
	let current: any = obj;

	for (const key of keys) {
		if (current === null || current === undefined) return undefined;
		current = current[key];
	}

	return current;
}

/**
 * Checks if a value matches the filter criteria
 * @param value - The value to check
 * @param filterValue - The filter criteria
 * @returns true if matches, false otherwise
 */
function matchesValue(value: unknown, filterValue: unknown): boolean {
	// If value is an array, check if it contains the filter value
	if (Array.isArray(value)) {
		return value.includes(filterValue);
	}

	// Direct equality check
	return value === filterValue;
}

/**
 * Filters an array based on criteria that can be an object filter or a predicate function.
 * Supports nested property filtering with dot notation and array property filtering.
 *
 * @param array - The array to filter
 * @param criteria - Either an object with filter criteria or a predicate function
 * @returns A new array containing only items that match the criteria
 *
 * @example
 * // Simple property filtering
 * const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
 * ArrayFilter(users, { age: 30 }); // [{ name: 'Jane', age: 30 }]
 *
 * @example
 * // Nested property filtering
 * const profiles = [
 *   { user: { name: 'John', active: true } },
 *   { user: { name: 'Jane', active: false } }
 * ];
 * ArrayFilter(profiles, { 'user.name': 'John' }); // [{ user: { name: 'John', active: true } }]
 *
 * @example
 * // Array property filtering
 * const posts = [
 *   { tags: ['js', 'web'] },
 *   { tags: ['ts', 'node'] }
 * ];
 * ArrayFilter(posts, { tags: 'js' }); // [{ tags: ['js', 'web'] }]
 *
 * @example
 * // Predicate function filtering
 * const numbers = [1, 2, 3, 4, 5];
 * ArrayFilter(numbers, (n) => n > 3); // [4, 5]
 */
export function ArrayFilter<T>(
	array: T[],
	criteria: Partial<Record<string, unknown>> | TPredicate<T>,
): T[] {
	// If criteria is a function, use it as predicate
	if (typeof criteria === 'function') {
		return array.filter(criteria);
	}

	// Object-based filtering with nested support
	return array.filter((item) => {
		return Object.entries(criteria).every(([key, filterValue]) => {
			const itemValue = getNestedValue(item, key);
			return matchesValue(itemValue, filterValue);
		});
	});
}
