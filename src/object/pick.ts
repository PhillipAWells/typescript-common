/**
 * Creates a new object with only the specified keys from the source object.
 * Type-safe implementation that preserves the original property types.
 *
 * @template T - The type of the source object
 * @template K - The keys to pick (must be keys of T)
 * @param obj - Source object to pick properties from
 * @param keys - Array of keys to include in the result
 * @returns New object containing only the specified keys with their original types
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   password: string;
 *   age: number;
 *   active: boolean;
 * }
 *
 * const user: User = {
 *   id: 1,
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'secret',
 *   age: 30,
 *   active: true
 * };
 *
 * // Pick specific properties for API response
 * const publicUser = ObjectPick(user, ['id', 'name', 'email']);
 * // Result: { id: 1, name: 'John Doe', email: 'john@example.com' }
 * // Type: Pick<User, 'id' | 'name' | 'email'>
 *
 * // Pick minimal user info
 * const minimalUser = ObjectPick(user, ['id', 'name']);
 * // Result: { id: 1, name: 'John Doe' }
 * // Type: Pick<User, 'id' | 'name'>
 *
 * // Type safety - prevents picking non-existent properties
 * // const invalid = ObjectPick(user, ['id', 'nonExistent']); // TypeScript error
 *
 * // Handle null/undefined safely
 * ObjectPick(null, ['id']); // Returns {}
 * ObjectPick(undefined, ['name']); // Returns {}
 * ```
 */
export function ObjectPick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	if (!obj) {
		return {} as Pick<T, K>;
	}

	return keys.reduce((result, key) => {
		if (Object.hasOwn(obj, key)) {
			result[key] = obj[key];
		}

		return result;
	}, {} as Pick<T, K>);
}
