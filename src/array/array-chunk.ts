/**
 * Chunks an array into smaller arrays of a specified size.
 * @param array The array to split.
 * @param size Size of each chunk.
 * @returns Array of arrays, each of the specified size.
 * @example
 * const chunks = ArrayChunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 */
export function ArrayChunk<T>(array: T[], size: number): T[][] {
	if (!array || size <= 0) {
		return [];
	}

	const result: T[][] = [];

	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}

	return result;
}
