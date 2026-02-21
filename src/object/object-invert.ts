/**
 * Inverts the keys and values of an object, producing a new object where the
 * original values become keys and the original keys become values.
 *
 * @template K - The original key type (must be a valid property key)
 * @template V - The original value type (must be a valid property key)
 * @param obj - The object to invert
 * @returns A new object with keys and values swapped
 *
 * @example
 * ```typescript
 * ObjectInvert({ a: 1, b: 2, c: 3 });
 * // { 1: 'a', 2: 'b', 3: 'c' }
 *
 * ObjectInvert({ read: 'r', write: 'w', execute: 'x' });
 * // { r: 'read', w: 'write', x: 'execute' }
 * ```
 */
export function ObjectInvert<
	K extends string | number | symbol,
	V extends string | number | symbol,
>(obj: Record<K, V>): Record<V, K> {
	const result = {} as Record<V, K>;

	for (const key of Object.keys(obj) as K[]) {
		result[(obj as Record<K, V>)[key]] = key;
	}

	return result;
}
