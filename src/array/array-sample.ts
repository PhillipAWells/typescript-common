/**
 * Returns a single random element from an array.
 *
 * @template T - The type of array elements
 * @param array - The array to sample from
 * @returns A random element, or `undefined` if the array is empty
 *
 * @example
 * ```typescript
 * ArraySample([1, 2, 3, 4, 5]); // e.g. 3
 * ```
 */
export function ArraySample<T>(array: T[]): T | undefined;

/**
 * Returns `n` unique random elements from an array (without replacement).
 * If `n` exceeds the array length, all elements are returned in random order.
 *
 * @template T - The type of array elements
 * @param array - The array to sample from
 * @param n - How many elements to sample
 * @returns An array of `n` randomly selected elements
 *
 * @example
 * ```typescript
 * ArraySample([1, 2, 3, 4, 5], 3); // e.g. [4, 1, 3]
 * ```
 */
export function ArraySample<T>(array: T[], n: number): T[];

export function ArraySample<T>(array: T[], n?: number): T | T[] | undefined {
	if (!array || array.length === 0) {
		return n !== undefined ? [] : undefined;
	}

	if (n === undefined) {
		return array[Math.floor(Math.random() * array.length)];
	}

	// Fisher-Yates partial shuffle for O(n) sampling
	const copy = [...array];
	const count = Math.min(n, copy.length);

	for (let i = 0; i < count; i++) {
		const j = i + Math.floor(Math.random() * (copy.length - i));
		const tmp = copy[j] as T;
		copy[j] = copy[i] as T;
		copy[i] = tmp;
	}

	return copy.slice(0, count);
}
