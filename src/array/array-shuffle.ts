/**
 * Returns a shuffled copy of the array using the Fisher-Yates algorithm.
 *
 * @template T - The type of array elements
 * @param array - The array to shuffle
 * @returns A new shuffled array (original is not mutated)
 *
 * @remarks Uses `Math.random()` — not cryptographically secure. Do not use for
 * security-sensitive operations.
 *
 * @example
 * ```typescript
 * ArrayShuffle([1, 2, 3, 4, 5]); // e.g. [3, 1, 5, 2, 4]
 * ```
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
