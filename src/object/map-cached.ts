import { MapObject } from './map.js';
import { ObjectHash } from './hash.js';
import type { TPropertyMapper, ICachedObjectMapOptions } from './types.js';

// Cache configuration constants
const DEFAULT_MAX_CACHE_SIZE = 1000;
const CACHE_EVICTION_PERCENTAGE = 0.2; // 20%
const INITIAL_CACHE_HASH_LENGTH = 16;

/**
 * Creates a cached version of MapObject for improved performance when mapping the same objects repeatedly
 *
 * @param options Configuration options for the cache
 * @returns A cached version of the map function
 */
export function MapObjectCached<T extends object>(options: ICachedObjectMapOptions = {}): (cursor: T, mapper: TPropertyMapper<T>, mapperKey?: string) => Promise<Record<keyof T, unknown>> {
	const { maxCacheSize = DEFAULT_MAX_CACHE_SIZE } = options;

	const cache = new Map<string, Map<string, Record<keyof T, unknown>>>();
	let totalCachedEntries = 0;

	/**
	 * Evicts approximately 20% of entries from the largest per-mapper cache bucket
	 * when the total number of cached results exceeds `maxCacheSize`.
	 *
	 * The eviction strategy targets the most-populated bucket to reclaim the most
	 * memory in a single pass while preserving results for other active mappers.
	 */
	const clearOldestEntries = (): void => {
		if (cache.size === 0) return;

		// Find the cache with the most entries
		let largestCache: Map<string, Record<keyof T, unknown>> | null = null;
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

	return (cursor: T, mapper: TPropertyMapper<T>, mapperKey?: string): Promise<Record<keyof T, unknown>> => {
		// Validate inputs
		if (!cursor || typeof cursor !== 'object') {
			return Promise.resolve({} as Record<keyof T, unknown>);
		}

		// Use the explicitly provided mapperKey when available.
		// WARNING: If mapperKey is omitted and mapper is a closure, two closures with
		// identical source code but different captured values will incorrectly share cache
		// entries. Always provide an explicit mapperKey when using closure mappers.
		const resolvedMapperKey = mapperKey ?? mapper.toString();

		// Try to get the object cache for this mapper
		let objectCache = cache.get(resolvedMapperKey);
		if (!objectCache) {
			objectCache = new Map<string, Record<keyof T, unknown>>();
			cache.set(resolvedMapperKey, objectCache);
		}

		// Create optimized hash-based cache key for the object being mapped
		let objectKey: string;

		try {
			objectKey = ObjectHash(cursor).substring(0, INITIAL_CACHE_HASH_LENGTH);
		} catch {
			// If object has circular references, skip caching and compute directly
			return Promise.resolve(MapObject(cursor, mapper));
		}

		// Check if we have a cached result
		if (objectCache.has(objectKey)) {
			const cachedResult = objectCache.get(objectKey);
			return Promise.resolve(cachedResult ?? {} as Record<keyof T, unknown>);
		}

		// Calculate the result
		const result = MapObject(cursor, mapper);

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
