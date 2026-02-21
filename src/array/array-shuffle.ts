/**
 * Returns a shuffled copy of the array using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns A new shuffled array.
 * @note Uses Math.random() — not cryptographically secure. Do not use for security-sensitive operations.
 */
export function ArrayShuffle<T>(array: T[]): T[] {
	if (!array) return [];

	const result = [...array];

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = result[i];
		result[i] = result[j] as T;
		result[j] = temp as T;
	}

	return result;
}
