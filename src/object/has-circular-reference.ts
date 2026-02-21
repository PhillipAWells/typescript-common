/**
 * Checks whether an object (or any nested value) contains circular references.
 *
 * @param obj - The value to inspect
 * @returns `true` if a circular reference is detected, `false` otherwise
 *
 * @example
 * ```typescript
 * ObjectHasCircularReference({ a: 1, b: { c: 2 } }); // false
 *
 * const circular: any = { a: 1 };
 * circular.self = circular;
 * ObjectHasCircularReference(circular); // true
 * ```
 */
export function ObjectHasCircularReference(obj: unknown): boolean {
	const seen = new WeakSet();

	const detectCircular = (value: unknown): boolean => {
		// Only check for circular references in non-null objects
		if (value === null || typeof value !== 'object') {
			return false;
		}

		// If we've seen this object before, it's a circular reference
		if (seen.has(value)) {
			return true;
		}

		// Mark this object as seen
		seen.add(value);

		// For arrays, check each element
		if (Array.isArray(value)) {
			for (const item of value) {
				if (detectCircular(item)) {
					return true;
				}
			}

			return false;
		}

		// For objects, check each own enumerable property
		const keys = Object.keys(value as Record<string, unknown>);

		for (const key of keys) {
			if (detectCircular((value as Record<string, unknown>)[key])) {
				return true;
			}
		}

		return false;
	};

	return detectCircular(obj);
}
