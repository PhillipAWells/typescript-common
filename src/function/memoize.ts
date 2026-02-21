/**
 * Returns a memoized version of `fn` that caches results by serialising its
 * arguments with `JSON.stringify` (or a custom `keyFn`).
 *
 * Only suitable for **pure functions** with serialisable arguments.
 *
 * @template T - The wrapped function type
 * @param fn - The function to memoize
 * @param keyFn - Optional custom cache-key function
 * @returns A memoized function with the same signature as `fn`
 *
 * @example
 * ```typescript
 * const expensiveCalc = Memoize((n: number) => n * n);
 * expensiveCalc(4); // computed
 * expensiveCalc(4); // cached → same value returned immediately
 *
 * // Custom key function:
 * const getUser = Memoize(fetchUser, (id) => `user:${id}`);
 * ```
 */
export function Memoize<T extends (...args: any[]) => any>(
	fn: T,
	keyFn?: (...args: Parameters<T>) => string,
): T {
	const cache = new Map<string, ReturnType<T>>();

	return function memoized(...args: Parameters<T>): ReturnType<T> {
		const key = keyFn ? keyFn(...args) : JSON.stringify(args);

		if (cache.has(key)) {
			return cache.get(key) as ReturnType<T>;
		}

		const result = fn(...args) as ReturnType<T>;
		cache.set(key, result);
		return result;
	} as T;
}
