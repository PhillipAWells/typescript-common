/**
 * Flattens a nested object into a single-level object, joining nested keys
 * with `separator` (default: `'.'`).
 *
 * Array values, `Date` instances, and `null` are treated as leaf values and
 * are not traversed.
 *
 * @param obj - The object to flatten
 * @param separator - The string used to join key segments (default: `'.'`)
 * @returns A new flat object with all nested keys joined by the separator
 *
 * @example
 * ```typescript
 * ObjectFlatten({ a: { b: { c: 1 }, d: 2 } });
 * // { 'a.b.c': 1, 'a.d': 2 }
 *
 * ObjectFlatten({ a: { b: 1 } }, '/');
 * // { 'a/b': 1 }
 * ```
 */
export function ObjectFlatten(
	obj: Record<string, unknown>,
	separator = '.',
	_prefix = '',
): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	for (const key of Object.keys(obj)) {
		const value = obj[key];
		const newKey = _prefix ? `${_prefix}${separator}${key}` : key;

		if (
			value !== null &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			!(value instanceof Date)
		) {
			Object.assign(result, ObjectFlatten(value as Record<string, unknown>, separator, newKey));
		} else {
			result[newKey] = value;
		}
	}

	return result;
}
