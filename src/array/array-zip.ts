/**
 * Zips multiple arrays together, pairing elements at the same index.
 * The result length is capped at the shortest input array.
 *
 * @param arrays - Two or more arrays to zip
 * @returns Array of tuples — one tuple per index position
 *
 * @example
 * ```typescript
 * ArrayZip([1, 2, 3], ['a', 'b', 'c']); // [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 * // Stops at shortest:
 * ArrayZip([1, 2, 3], ['a', 'b']); // [[1, 'a'], [2, 'b']]
 *
 * // Three arrays:
 * ArrayZip([1, 2], ['a', 'b'], [true, false]); // [[1, 'a', true], [2, 'b', false]]
 * ```
 */
export function ArrayZip<T extends readonly unknown[][]>(
	...arrays: T
): { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] {
	if (!arrays.length) return [];

	const minLen = Math.min(...arrays.map((a) => a.length));
	return Array.from({ length: minLen }, (_, i) =>
		arrays.map((a) => a[i]),
	) as { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[];
}
