/**
 * Returns a `Promise` that resolves after `ms` milliseconds.
 * Useful for adding delays in async functions or tests.
 *
 * @param ms - Number of milliseconds to wait
 * @returns A `Promise` that resolves (with `void`) after the delay
 *
 * @example
 * ```typescript
 * await Sleep(500); // pause for 500 ms
 *
 * // Retry with back-off:
 * for (let i = 0; i < 3; i++) {
 *   try { return await fetchData(); }
 *   catch { await Sleep(100 * 2 ** i); }
 * }
 * ```
 */
export async function Sleep(ms: number): Promise<void> {
	await new Promise<void>((resolve) => setTimeout(resolve, ms));
}
