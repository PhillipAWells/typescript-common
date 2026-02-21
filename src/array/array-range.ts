/**
 * Generates an array of numbers from `start` to `end` (exclusive) with an optional `step`.
 *
 * @param start - The first value in the range
 * @param end - The value to stop before (exclusive)
 * @param step - Increment between values (default: `1`; use negative for descending ranges)
 * @returns Array of numbers
 *
 * @example
 * ```typescript
 * ArrayRange(0, 5);        // [0, 1, 2, 3, 4]
 * ArrayRange(0, 10, 2);    // [0, 2, 4, 6, 8]
 * ArrayRange(5, 0, -1);    // [5, 4, 3, 2, 1]
 * ArrayRange(0, 1, 0.5);   // [0, 0.5]
 * ```
 */
export function ArrayRange(start: number, end: number, step = 1): number[] {
	if (step === 0) return [];
	if (step > 0 && start >= end) return [];
	if (step < 0 && start <= end) return [];

	const result: number[] = [];

	for (let i = start; step > 0 ? i < end : i > end; i += step) {
		result.push(i);
	}

	return result;
}
