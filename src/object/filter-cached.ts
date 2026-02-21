import { ObjectFilter } from './filter.js';
import { ObjectHash } from './hash.js';
import type { ICachedObjectFilterOptions, TCachedObjectFilterFunction, IObjectFilterOptions } from './types.js';

// Cache configuration constants
const DEFAULT_MAX_CACHE_SIZE = 1000;
const CACHE_EVICTION_PERCENTAGE = 0.2; // 20%
const INITIAL_CACHE_HASH_LENGTH = 16;

/**
 * Creates a cached version of {@link ObjectFilter} for improved performance
 * when filtering the same objects repeatedly.
 *
 * Results are cached by hashing the filter and object together. When the cache
 * exceeds `maxCacheSize`, approximately 20% of the entries in the largest
 * per-filter bucket are evicted.
 *
 * @template T - The object type being filtered
 * @param options - Configuration for both the cache and the underlying filter
 * @returns A cached filter function `(cursor, filter) => Promise<boolean>`
 *
 * @example
 * ```typescript
 * const cachedFilter = ObjectFilterCached<User>({ maxCacheSize: 500 });
 * const isAdmin = await cachedFilter(user, { role: 'admin' });
 * ```
 */
export function ObjectFilterCached<T extends object>(options: ICachedObjectFilterOptions = {}): TCachedObjectFilterFunction<T> {
	const {
		maxCacheSize = DEFAULT_MAX_CACHE_SIZE,
		useDeepEqual = false,
		caseInsensitiveStrings = false,
		validatePaths = true,
	} = options;

	const cache = new Map<string, Map<string, boolean>>();
	let totalCachedEntries = 0;

	/**
	 * Evicts approximately 20% of entries from the largest per-filter cache bucket
	 * when the total number of cached results exceeds `maxCacheSize`.
	 *
	 * The eviction strategy targets the most-populated bucket to reclaim the most
	 * memory in a single pass while preserving results for other active filters.
	 */
	const clearOldestEntries = (): void => {
		if (cache.size === 0) return;

		// Find the cache with the most entries
		let largestCache: Map<string, boolean> | null = null;
		let largestCacheKey = '';
		let largestSize = 0;

		for (const [key, objectCache] of cache.entries()) {
			if (objectCache.size > largestSize) {
				largestCache = objectCache;
				largestCacheKey = key;
				largestSize = objectCache.size;
			}
		}

		if (largestCache) {
			// Remove approximately 20% of entries from the largest cache
			const entriesToRemove = Math.ceil(largestSize * CACHE_EVICTION_PERCENTAGE);
			let removed = 0;

			for (const key of largestCache.keys()) {
				largestCache.delete(key);
				removed++;
				if (removed >= entriesToRemove) break;
			}

			// If the cache is now empty, remove it completely
			if (largestCache.size === 0) {
				cache.delete(largestCacheKey);
			}

			totalCachedEntries -= removed;
		}
	};

	return (cursor: T, filter: Partial<Record<string, any>>): Promise<boolean> => {
		// Validate inputs
		if (!cursor || typeof cursor !== 'object') {
			return Promise.resolve(false);
		}

		if (!filter || typeof filter !== 'object') {
			return Promise.resolve(true); // Empty filter matches everything
		}

		// Optimize cache key generation with shorter hash for better performance
		const filterKey = ObjectHash(filter).substring(0, INITIAL_CACHE_HASH_LENGTH);

		// Try to get the object cache for this filter
		let objectCache = cache.get(filterKey);
		if (!objectCache) {
			objectCache = new Map<string, boolean>();
			cache.set(filterKey, objectCache);
		}

		// Create optimized hash-based cache key for the object being filtered
		// Use shorter hash for better memory efficiency and performance
		let objectKey: string;

		try {
			objectKey = ObjectHash(cursor).substring(0, INITIAL_CACHE_HASH_LENGTH);
		} catch {
			// If object has circular references, skip caching and compute directly
			const filterOptions: IObjectFilterOptions = {
				useDeepEqual,
				caseInsensitiveStrings,
				validatePaths,
			};
			return Promise.resolve(ObjectFilter(cursor, filter, filterOptions));
		}

		// Check if we have a cached result
		if (objectCache.has(objectKey)) {
			const cachedResult = objectCache.get(objectKey);
			return Promise.resolve(cachedResult ?? false);
		}

		// Calculate the result
		const filterOptions: IObjectFilterOptions = {
			useDeepEqual,
			caseInsensitiveStrings,
			validatePaths,
		};

		const result = ObjectFilter(cursor, filter, filterOptions);
		// Cache the result
		objectCache.set(objectKey, result);
		totalCachedEntries++;

		// Ensure the cache size does not exceed the limit
		if (totalCachedEntries > maxCacheSize) {
			clearOldestEntries();
		}

		return Promise.resolve(result);
	};
}
