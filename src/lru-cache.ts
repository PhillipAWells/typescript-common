/**
 * Generic Least Recently Used (LRU) Cache implementation.
 *
 * An `LRUCache` maintains a fixed-size cache of key-value pairs.
 * When capacity is reached, the least recently used (oldest) entry is evicted.
 * Both `get()` and `set()` operations update the recency order.
 *
 * @typeParam K - Key type
 * @typeParam V - Value type
 *
 * @example
 * ```typescript
 * const cache = new LRUCache<string, number>(2);
 * cache.set('a', 1);
 * cache.set('b', 2);
 * cache.set('c', 3); // Evicts 'a' since capacity is 2
 * console.log(cache.get('a')); // undefined
 * console.log(cache.get('b')); // 2
 * ```
 */
export class LRUCache<K, V> {
	private readonly _map = new Map<K, V>();

	private readonly _maxSize: number;

	/**
	 * Creates a new `LRUCache` instance.
	 *
	 * @param maxSize - Maximum number of entries to cache before evicting the least recently used
	 * @throws {Error} If maxSize is less than 1
	 *
	 * @example
	 * ```typescript
	 * const cache = new LRUCache<string, string>(100);
	 * ```
	 */
	constructor(maxSize: number) {
		if (maxSize < 1) {
			throw new Error('LRUCache maxSize must be at least 1');
		}
		this._maxSize = maxSize;
	}

	/**
	 * The current number of cached entries.
	 */
	public get size(): number {
		return this._map.size;
	}

	/**
	 * Retrieves a value from the cache by key.
	 *
	 * Accessing a value marks it as recently used, moving it to the end of the
	 * eviction order.
	 *
	 * @param key - The key to look up
	 * @returns The cached value, or `undefined` if not found
	 *
	 * @example
	 * ```typescript
	 * const cache = new LRUCache<string, number>(2);
	 * cache.set('a', 1);
	 * console.log(cache.get('a')); // 1
	 * console.log(cache.get('b')); // undefined
	 * ```
	 */
	public get(key: K): V | undefined {
		const value = this._map.get(key);
		if (value !== undefined) {
			// Move to end (mark as recently used)
			this._map.delete(key);
			this._map.set(key, value);
		}
		return value;
	}

	/**
	 * Sets a value in the cache.
	 *
	 * If the key already exists, its value is updated and it is marked as
	 * recently used. If the cache is at capacity and a new key is added,
	 * the least recently used (first) entry is evicted.
	 *
	 * @param key - The key to cache
	 * @param value - The value to associate with the key
	 *
	 * @example
	 * ```typescript
	 * const cache = new LRUCache<string, number>(2);
	 * cache.set('a', 1);
	 * cache.set('b', 2);
	 * cache.set('c', 3); // Evicts 'a' since cache is full
	 * ```
	 */
	public set(key: K, value: V): void {
		// If key already exists, delete it (will re-add at end)
		if (this._map.has(key)) {
			this._map.delete(key);
		} else if (this._map.size >= this._maxSize) {
			// If at capacity and adding a new key, evict the oldest (first) entry
			const firstKey = this._map.keys().next().value;
			if (firstKey !== undefined) {
				this._map.delete(firstKey);
			}
		}

		// Add at the end (mark as recently used)
		this._map.set(key, value);
	}

	/**
	 * Clears all entries from the cache.
	 *
	 * @example
	 * ```typescript
	 * const cache = new LRUCache<string, number>(10);
	 * cache.set('a', 1);
	 * cache.clear();
	 * console.log(cache.size); // 0
	 * ```
	 */
	public clear(): void {
		this._map.clear();
	}
}
