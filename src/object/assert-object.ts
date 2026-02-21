/**
 * Type guard that checks if the provided value is a non-null, non-array object
 *
 * @param item - The value to check
 * @returns True if the value is an object (not null and not an array)
 */
export function AssertObject(item: unknown): item is Record<string, any> {
	return item !== null && typeof item === 'object' && !Array.isArray(item);
}
