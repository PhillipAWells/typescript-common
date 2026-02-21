/**
 * Creates a new object without the specified keys from the source object.
 *
 * @template T - The type of the source object
 * @template K - The keys to omit (must be keys of `T`)
 * @param obj - Source object
 * @param keys - Array of keys to exclude from the result
 * @returns A shallow copy of `obj` without the specified keys
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', password: 'secret' };
 * ObjectOmit(user, ['password']); // { id: 1, name: 'John' }
 * ```
 */
export function ObjectOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	if (!obj) {
		return {} as Omit<T, K>;
	}

	const result = { ...obj };
	keys.forEach((key) => {
		delete result[key];
	});
	return result as Omit<T, K>;
}
