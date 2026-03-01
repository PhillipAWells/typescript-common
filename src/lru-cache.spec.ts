import { describe, it, expect } from 'vitest';
import { LRUCache } from './lru-cache.js';

describe('LRUCache', () => {
	it('should create an empty cache', () => {
		const cache = new LRUCache<string, number>(10);
		expect(cache.size).toBe(0);
	});

	it('should store and retrieve values', () => {
		const cache = new LRUCache<string, number>(10);
		cache.set('a', 1);
		expect(cache.get('a')).toBe(1);
	});

	it('should return undefined for missing keys', () => {
		const cache = new LRUCache<string, number>(10);
		expect(cache.get('missing')).toBeUndefined();
	});

	it('should evict least recently used entry when at capacity', () => {
		const cache = new LRUCache<string, number>(2);
		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('c', 3); // Should evict 'a'

		expect(cache.get('a')).toBeUndefined();
		expect(cache.get('b')).toBe(2);
		expect(cache.get('c')).toBe(3);
	});

	it('should mark recently accessed entries as active', () => {
		const cache = new LRUCache<string, number>(2);
		cache.set('a', 1);
		cache.set('b', 2);
		cache.get('a'); // Access 'a' to mark as recently used
		cache.set('c', 3); // Should evict 'b' (least recently used)

		expect(cache.get('a')).toBe(1);
		expect(cache.get('b')).toBeUndefined();
		expect(cache.get('c')).toBe(3);
	});

	it('should update value for existing key without changing size', () => {
		const cache = new LRUCache<string, number>(2);
		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('a', 10); // Update existing key

		expect(cache.size).toBe(2);
		expect(cache.get('a')).toBe(10);
	});

	it('should mark updated entries as recently used', () => {
		const cache = new LRUCache<string, number>(2);
		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('a', 10); // Update 'a' to mark it as recently used
		cache.set('c', 3); // Should evict 'b'

		expect(cache.get('a')).toBe(10);
		expect(cache.get('b')).toBeUndefined();
		expect(cache.get('c')).toBe(3);
	});

	it('should support clear operation', () => {
		const cache = new LRUCache<string, number>(10);
		cache.set('a', 1);
		cache.set('b', 2);
		cache.clear();

		expect(cache.size).toBe(0);
		expect(cache.get('a')).toBeUndefined();
		expect(cache.get('b')).toBeUndefined();
	});

	it('should work with different key and value types', () => {
		const cache = new LRUCache<number, string>(5);
		cache.set(1, 'one');
		cache.set(2, 'two');

		expect(cache.get(1)).toBe('one');
		expect(cache.get(2)).toBe('two');
	});

	it('should throw error for invalid maxSize', () => {
		expect(() => new LRUCache<string, number>(0)).toThrow('LRUCache maxSize must be at least 1');
		expect(() => new LRUCache<string, number>(-1)).toThrow('LRUCache maxSize must be at least 1');
	});

	it('should handle single-entry cache', () => {
		const cache = new LRUCache<string, number>(1);
		cache.set('a', 1);
		expect(cache.get('a')).toBe(1);

		cache.set('b', 2); // Should evict 'a'
		expect(cache.get('a')).toBeUndefined();
		expect(cache.get('b')).toBe(2);
	});

	it('should maintain correct size after operations', () => {
		const cache = new LRUCache<string, number>(3);
		cache.set('a', 1);
		expect(cache.size).toBe(1);

		cache.set('b', 2);
		expect(cache.size).toBe(2);

		cache.set('c', 3);
		expect(cache.size).toBe(3);

		cache.set('d', 4); // Evict 'a'
		expect(cache.size).toBe(3);

		cache.clear();
		expect(cache.size).toBe(0);
	});
});
