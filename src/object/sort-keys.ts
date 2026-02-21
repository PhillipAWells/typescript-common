/**
 * Sorts the keys of an object alphabetically and returns a new object with the same type
 *
 * @template T - The type of the input object
 * @param object - Object whose keys should be sorted
 * @returns A new object with sorted keys maintaining the original type
 *
 * @example
 * ```typescript
 * const input = { z: 1, a: 2, m: 3 };
 * const sorted = ObjectSortKeys(input);
 * // Result: { a: 2, m: 3, z: 1 }
 *
 * // With complex object
 * const user = {
 *   name: 'John',
 *   age: 30,
 *   email: 'john@example.com',
 *   active: true
 * };
 * const sortedUser = ObjectSortKeys(user);
 * // Result: { active: true, age: 30, email: 'john@example.com', name: 'John' }
 * ```
 */
export function ObjectSortKeys<T extends Record<string, any>>(object: T): T {
	if (!object || typeof object !== 'object' || Array.isArray(object)) {
		return object;
	}

	const sorted = Object.keys(object).sort((a, b) => {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	})
		.reduce(
			(entry: T, key: string) => {
				entry[key as keyof T] = object[key as keyof T];
				return entry;
			},
			{} as T,
		);

	// Preserve non-enumerable properties
	const allKeys = Object.getOwnPropertyNames(object);

	for (const key of allKeys) {
		if (!Object.prototype.hasOwnProperty.call(sorted, key)) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);
			if (descriptor) {
				Object.defineProperty(sorted, key, descriptor);
			}
		}
	}

	return sorted;
}
