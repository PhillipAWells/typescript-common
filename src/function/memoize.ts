import { LRUCache } from '../lru-cache.js';

/**
 * Returns a memoized version of `fn` that caches results by serialising its
 * arguments with `JSON.stringify` (or a custom `keyFn`).
 *
 * Only suitable for **pure functions** with serialisable arguments.
 *
 * Uses an LRU (Least Recently Used) eviction policy: when the cache reaches
 * `maxCacheSize`, the entry that was accessed least recently is evicted.
 *
 * @template T - The wrapped function type
 * @param fn - The function to memoize
 * @param keyFn - Optional custom cache-key function
 * @param maxCacheSize - Maximum number of cache entries before LRU eviction (default: 1000)
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
 *
 * // With custom cache size:
 * const cached = Memoize(fn, undefined, 500);
 * ```
 */
export function Memoize<T extends (...args: any[]) => any>(
	fn: T,
	keyFn?: (...args: Parameters<T>) => string,
	// eslint-disable-next-line no-magic-numbers
	maxCacheSize = 1000,
): T {
	const cache = new LRUCache<string, ReturnType<T>>(maxCacheSize);

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
