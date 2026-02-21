/**
 * Checks whether an object contains circular references
 *
 * @param obj - The object to check for circular references
 * @returns True if the object contains circular references, false otherwise
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
