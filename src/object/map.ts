import type { TPropertyMapper } from './types.js';

/**
 * Maps an object's properties using a mapper function.
 * Creates a new object where each property value is transformed by the mapper function.
 *
 * @template T - The type of the source object
 * @param obj - The object to map
 * @param mapper - A function that takes a property key and value, returning the new value
 * @returns A new object with mapped property values
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * const mapped = MapObject(obj, (key, value) => value * 2);
 * // Result: { a: 2, b: 4, c: 6 }
 *
 * // Type-safe mapping with different value types
 * interface User { id: number; name: string; age: number; }
 * const user: User = { id: 1, name: 'John', age: 30 };
 * const displayData = MapObject(user, (key, value) => {
 *   if (key === 'name') return value.toUpperCase();
 *   if (key === 'age') return `${value} years old`;
 *   return value;
 * });
 * // Result: { id: 1, name: 'JOHN', age: '30 years old' }
 * ```
 */
export function MapObject<T extends object>(obj: T, mapper: TPropertyMapper<T>): Record<keyof T, unknown> {
	if (!obj || typeof obj !== 'object') {
		return {} as Record<keyof T, unknown>;
	}

	const result: Record<keyof T, unknown> = {} as Record<keyof T, unknown>;

	for (const key in obj) {
		if (Object.hasOwn(obj, key)) {
			const value = obj[key];
			result[key] = mapper(key as keyof T, value);
		}
	}

	return result;
}
