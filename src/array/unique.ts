/**
 * Returns a new array with duplicate values removed.
 * @param array The input array.
 * @returns A new array with unique values.
 * @note Uses reference equality for objects. Two distinct objects with identical property values are NOT deduplicated.
 */
export function Unique<T>(array: T[]): T[] {
	if (!array) {
		return [];
	}

	return [...new Set(array)];
}
