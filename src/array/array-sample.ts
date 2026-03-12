/**
 * Returns a single random element from an array.
 *
 * @template T - The type of array elements
 * @param array - The array to sample from
 * @param random - Optional custom RNG function (returns number between 0 and 1). Defaults to `Math.random`.
 * @returns A random element, or `undefined` if the array is empty
 *
 * @example
 * ```typescript
 * ArraySample([1, 2, 3, 4, 5]); // e.g. 3
 * ArraySample([1, 2, 3], () => 0.5); // deterministic with custom RNG
 * ```
 */
export function ArraySample<T>(array: readonly T[], random?: () => number): T | undefined;

/**
 * Returns `n` unique random elements from an array (without replacement).
 * If `n` exceeds the array length, all elements are returned in random order.
 *
 * @template T - The type of array elements
 * @param array - The array to sample from
 * @param n - How many elements to sample
 * @param random - Optional custom RNG function (returns number between 0 and 1). Defaults to `Math.random`.
 * @returns An array of `n` randomly selected elements
 *
 * @example
 * ```typescript
 * ArraySample([1, 2, 3, 4, 5], 3); // e.g. [4, 1, 3]
 * ArraySample([1, 2, 3], 2, () => 0.5); // deterministic with custom RNG
 * ```
 */
export function ArraySample<T>(array: readonly T[], n: number, random?: () => number): T[];

export function ArraySample<T>(array: readonly T[], n?: number | (() => number), random?: () => number): T | T[] | undefined {
	// Handle overload where second argument is RNG function
	let sampleCount: number | undefined;
	let rng: () => number = random ?? Math.random;

	if (typeof n === 'function') {
		rng = n;
		sampleCount = undefined;
	} else {
		sampleCount = n;
	}

	if (!array || array.length === 0) {
		return sampleCount !== undefined ? [] : undefined;
	}

	if (sampleCount === undefined) {
		return array[Math.floor(rng() * array.length)];
	}

	// Fisher-Yates partial shuffle for O(n) sampling
	const copy = [...array];
	const count = Math.min(sampleCount, copy.length);

	for (let i = 0; i < count; i++) {
		const j = i + Math.floor(rng() * (copy.length - i));
		const tmp = copy[j] as T;
		copy[j] = copy[i] as T;
		copy[i] = tmp;
	}

	return copy.slice(0, count);
}
