import { filterDangerousKeys } from './security-utils.js';

/**
 * Merges two objects deeply with security protections
 *
 * **Security Features:**
 * - Prevents prototype pollution by filtering dangerous keys
 * - Safely handles nested object merging
 * - Protects against malicious source objects
 *
 * @param target Target object
 * @param source Source object
 * @returns Merged object
 */
export function ObjectMerge<T extends object = object>(target: T, source: Partial<T>): T {
	if (!target || typeof target !== 'object') return target as T;
	if (!source || typeof source !== 'object') return target;

	// Security: Filter out dangerous keys from source object
	const safeSource = filterDangerousKeys(source as Record<string, any>);

	const output = { ...target };
	Object.keys(safeSource).forEach((key) => {
		// Additional safety check - only process own properties
		if (!Object.prototype.hasOwnProperty.call(safeSource, key)) {
			return;
		}

		const targetValue = (output as Record<string, any>)[key];
		const sourceValue = safeSource[key];

		if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
			(output as Record<string, any>)[key] = [...targetValue, ...sourceValue];
		} else if (
			targetValue && typeof targetValue === 'object' && sourceValue && typeof sourceValue === 'object'
		) {
			(output as Record<string, any>)[key] = ObjectMerge(targetValue, sourceValue);
		} else {
			(output as Record<string, any>)[key] = sourceValue;
		}
	});

	return output as T;
}
