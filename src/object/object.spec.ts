import { describe, it, expect, vi } from 'vitest';
import { AssertObject } from './assert-object.js';
import { ObjectClone } from './clone.js';
import { ObjectEquals } from './equals.js';
import { ObjectFilter } from './filter.js';
import { ObjectFilterCached } from './filter-cached.js';
import { ObjectHasCircularReference } from './has-circular-reference.js';
import { ObjectHash } from './hash.js';
import { ObjectFromKeyValuePairs, ObjectToKeyValuePairs } from './key-value-pairs.js';
import { MapObject } from './map.js';
import { MapObjectCached } from './map-cached.js';
import { ObjectMerge } from './merge.js';
import { ObjectOmit } from './omit.js';
import { ObjectPick } from './pick.js';
import { ObjectGetPropertyByPath } from './property-paths.js';
import { ObjectSortKeys } from './sort-keys.js';
import { ObjectInvert } from './object-invert.js';
import { ObjectFlatten } from './object-flatten.js';
import { ObjectDiff } from './object-diff.js';

// ----- AssertObject -----

describe('AssertObject', () => {
	it('returns true for a plain object', () => {
		expect(AssertObject({ a: 1 })).toBe(true);
	});

	it('returns false for null', () => {
		expect(AssertObject(null)).toBe(false);
	});

	it('returns false for arrays', () => {
		expect(AssertObject([1, 2, 3])).toBe(false);
	});

	it('returns false for primitives', () => {
		expect(AssertObject(42)).toBe(false);
		expect(AssertObject('string')).toBe(false);
		expect(AssertObject(true)).toBe(false);
	});

	it('returns true for empty object', () => {
		expect(AssertObject({})).toBe(true);
	});
});

// ----- ObjectClone -----

describe('ObjectClone', () => {
	it('deeply clones a plain object', () => {
		const original = { a: 1, b: { c: 2 } };
		const clone = ObjectClone(original);
		expect(clone).toEqual(original);
		expect(clone).not.toBe(original);
		expect(clone.b).not.toBe(original.b);
	});

	it('clones arrays', () => {
		const original = [1, 2, [3, 4]];
		const clone = ObjectClone(original);
		expect(clone).toEqual(original);
		expect(clone).not.toBe(original);
	});

	it('clones Date objects', () => {
		const date = new Date('2024-01-01');
		const clone = ObjectClone(date);
		expect(clone).toEqual(date);
		expect(clone).not.toBe(date);
	});

	it('returns null/undefined as-is', () => {
		expect(ObjectClone(null)).toBeNull();
		expect(ObjectClone(undefined)).toBeUndefined();
	});

	it('throws on circular references', () => {
		const obj: any = { a: 1 };
		obj.self = obj;
		expect(() => ObjectClone(obj)).toThrow();
	});

	it('clones primitives unchanged', () => {
		expect(ObjectClone(42)).toBe(42);
		expect(ObjectClone('hello')).toBe('hello');
		expect(ObjectClone(true)).toBe(true);
	});
});

// ----- ObjectEquals -----

describe('ObjectEquals', () => {
	it('returns true for identical primitives', () => {
		expect(ObjectEquals(42, 42)).toBe(true);
		expect(ObjectEquals('hello', 'hello')).toBe(true);
	});

	it('returns false for different primitives', () => {
		expect(ObjectEquals(1, 2)).toBe(false);
	});

	it('returns true for deeply equal objects', () => {
		expect(ObjectEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
	});

	it('returns false for objects with different values', () => {
		expect(ObjectEquals({ a: 1 }, { a: 2 })).toBe(false);
	});

	it('returns true for deeply equal arrays', () => {
		expect(ObjectEquals([1, 2, [3]], [1, 2, [3]])).toBe(true);
	});

	it('returns false for arrays with different values', () => {
		expect(ObjectEquals([1, 2], [1, 3])).toBe(false);
	});

	it('treats NaN as equal to NaN', () => {
		expect(ObjectEquals(NaN, NaN)).toBe(true);
	});

	it('returns false for null vs undefined', () => {
		expect(ObjectEquals(null, undefined)).toBe(false);
	});

	it('handles Date comparisons', () => {
		expect(ObjectEquals(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true);
		expect(ObjectEquals(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false);
	});

	it('returns true for same reference', () => {
		const obj = { a: 1 };
		expect(ObjectEquals(obj, obj)).toBe(true);
	});
});

// ----- ObjectFilter -----

describe('ObjectFilter', () => {
	it('returns true when object matches simple filter', () => {
		expect(ObjectFilter({ name: 'Alice', age: 25 }, { name: 'Alice' })).toBe(true);
	});

	it('returns false when object does not match', () => {
		expect(ObjectFilter({ name: 'Alice', age: 25 }, { name: 'Bob' })).toBe(false);
	});

	it('supports nested path filtering', () => {
		const obj = { user: { name: 'Alice', active: true } };
		expect(ObjectFilter(obj, { 'user.name': 'Alice' })).toBe(true);
		expect(ObjectFilter(obj, { 'user.name': 'Bob' })).toBe(false);
	});

	it('returns true for empty filter', () => {
		expect(ObjectFilter({ a: 1 }, {})).toBe(true);
	});

	it('supports case-insensitive string matching', () => {
		expect(ObjectFilter({ name: 'Alice' }, { name: 'alice' }, { caseInsensitiveStrings: true })).toBe(true);
	});
});

// ----- ObjectFilterCached -----

describe('ObjectFilterCached', () => {
	it('returns correct result on first call', async () => {
		const filter = ObjectFilterCached<{ name: string; age: number }>();
		const result = await filter({ name: 'Alice', age: 25 }, { name: 'Alice' });
		expect(result).toBe(true);
	});

	it('returns cached result on second call', async () => {
		const filter = ObjectFilterCached<{ name: string; age: number }>();
		const obj = { name: 'Alice', age: 25 };
		const first = await filter(obj, { name: 'Alice' });
		const second = await filter(obj, { name: 'Alice' });
		expect(first).toBe(true);
		expect(second).toBe(true);
	});
});

// ----- ObjectHasCircularReference -----

describe('ObjectHasCircularReference', () => {
	it('returns false for a plain object', () => {
		expect(ObjectHasCircularReference({ a: 1 })).toBe(false);
	});

	it('returns true for a circular reference', () => {
		const obj: any = { a: 1 };
		obj.self = obj;
		expect(ObjectHasCircularReference(obj)).toBe(true);
	});

	it('returns false for null and primitives', () => {
		expect(ObjectHasCircularReference(null)).toBe(false);
		expect(ObjectHasCircularReference(42)).toBe(false);
	});

	it('returns false for nested non-circular objects', () => {
		expect(ObjectHasCircularReference({ a: { b: { c: 1 } } })).toBe(false);
	});

	it('detects circular reference in arrays', () => {
		const arr: any[] = [1, 2];
		arr.push(arr);
		expect(ObjectHasCircularReference(arr)).toBe(true);
	});
});

// ----- ObjectHash -----

describe('ObjectHash', () => {
	it('returns a non-empty string', () => {
		const hash = ObjectHash({ a: 1 });
		expect(typeof hash).toBe('string');
		expect(hash.length).toBeGreaterThan(0);
	});

	it('returns the same hash for identical objects', () => {
		expect(ObjectHash({ a: 1, b: 2 })).toBe(ObjectHash({ a: 1, b: 2 }));
	});

	it('returns different hashes for different objects', () => {
		expect(ObjectHash({ a: 1 })).not.toBe(ObjectHash({ a: 2 }));
	});

	it('throws for objects with circular references', () => {
		const obj: any = { a: 1 };
		obj.self = obj;
		expect(() => ObjectHash(obj)).toThrow();
	});

	it('uses a custom hash function when provided', () => {
		const mockHashFn = vi.fn(() => 'custom-hash');
		expect(ObjectHash({ a: 1 }, mockHashFn)).toBe('custom-hash');
		expect(mockHashFn).toHaveBeenCalledOnce();
	});
});

// ----- ObjectFromKeyValuePairs -----

describe('ObjectFromKeyValuePairs', () => {
	it('builds an object from key-value pairs', () => {
		expect(ObjectFromKeyValuePairs([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 });
	});

	it('returns empty object for empty array', () => {
		expect(ObjectFromKeyValuePairs([])).toEqual({});
	});

	it('handles string values', () => {
		expect(ObjectFromKeyValuePairs([['greeting', 'hello']])).toEqual({ greeting: 'hello' });
	});
});

// ----- MapObject -----

describe('MapObject', () => {
	it('maps all property values', () => {
		const result = MapObject({ a: 1, b: 2, c: 3 }, (_, v) => (v as number) * 2);
		expect(result).toEqual({ a: 2, b: 4, c: 6 });
	});

	it('provides the key to the mapper', () => {
		const keys: string[] = [];
		MapObject({ x: 1, y: 2 }, (k) => {
			keys.push(k as string);
			return 0;
		});
		expect(keys.sort()).toEqual(['x', 'y']);
	});

	it('returns empty object for null/invalid input', () => {
		expect(MapObject(null as any, (_, v) => v)).toEqual({});
	});
});

// ----- MapObjectCached -----

describe('MapObjectCached', () => {
	it('maps an object correctly on first call', async () => {
		const mapFn = MapObjectCached<{ a: number; b: number }>();
		const result = await mapFn({ a: 1, b: 2 }, (_, v) => (v as number) * 2);
		expect(result).toEqual({ a: 2, b: 4 });
	});

	it('returns cached result on repeated calls', async () => {
		const mapper = vi.fn((_, v: unknown) => (v as number) * 2);
		const mapFn = MapObjectCached<{ a: number }>();
		const obj = { a: 5 };
		const first = await mapFn(obj, mapper, 'doubler');
		const second = await mapFn(obj, mapper, 'doubler');
		// Second call should return the cached result without invoking the mapper again
		expect(first).toEqual({ a: 10 });
		expect(second).toEqual({ a: 10 });
		// Mapper is called once per key on first call, zero times on subsequent cached calls
		expect(mapper).toHaveBeenCalledTimes(1);
	});
});

// ----- ObjectMerge -----

describe('ObjectMerge', () => {
	it('merges top-level properties', () => {
		expect(ObjectMerge({ a: 1 } as any, { b: 2 })).toEqual({ a: 1, b: 2 });
	});

	it('overwrites existing properties', () => {
		expect(ObjectMerge({ a: 1, b: 2 }, { b: 3 })).toEqual({ a: 1, b: 3 });
	});

	it('deep merges nested objects', () => {
		const target = { user: { name: 'Alice', age: 30 } };
		const source = { user: { age: 31 } } as Partial<typeof target>;
		const result = ObjectMerge(target, source);
		expect(result.user.name).toBe('Alice');
		expect(result.user.age).toBe(31);
	});

	it('concatenates arrays', () => {
		const result = ObjectMerge({ tags: ['a', 'b'] }, { tags: ['c'] });
		expect(result.tags).toEqual(['a', 'b', 'c']);
	});

	it('returns target unchanged when source is invalid', () => {
		const target = { a: 1 };
		expect(ObjectMerge(target, null as any)).toEqual({ a: 1 });
		expect(ObjectMerge(target, undefined as any)).toEqual({ a: 1 });
	});

	it('blocks prototype pollution attempts', () => {
		const malicious = JSON.parse('{"__proto__":{"polluted":true}}');
		ObjectMerge({} as any, malicious);
		expect((({}) as any).polluted).toBeUndefined();
	});
});

// ----- ObjectOmit -----

describe('ObjectOmit', () => {
	it('omits the specified keys', () => {
		const result = ObjectOmit({ a: 1, b: 2, c: 3 }, ['b']);
		expect(result).toEqual({ a: 1, c: 3 });
	});

	it('omits multiple keys', () => {
		const result = ObjectOmit({ a: 1, b: 2, c: 3 }, ['a', 'c']);
		expect(result).toEqual({ b: 2 });
	});

	it('returns full object when keys array is empty', () => {
		expect(ObjectOmit({ a: 1, b: 2 }, [])).toEqual({ a: 1, b: 2 });
	});

	it('returns empty object for null input', () => {
		expect(ObjectOmit(null as any, ['a'])).toEqual({});
	});
});

// ----- ObjectPick -----

describe('ObjectPick', () => {
	it('picks the specified keys', () => {
		const result = ObjectPick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
		expect(result).toEqual({ a: 1, c: 3 });
	});

	it('ignores keys not present in the object', () => {
		const result = ObjectPick({ a: 1 } as any, ['a', 'nonExistent' as any]);
		expect(result).toEqual({ a: 1 });
	});

	it('returns empty object for empty keys', () => {
		expect(ObjectPick({ a: 1 }, [])).toEqual({});
	});

	it('returns empty object for null input', () => {
		expect(ObjectPick(null as any, ['a'])).toEqual({});
	});
});

// ----- ObjectGetPropertyByPath -----

describe('ObjectGetPropertyByPath', () => {
	const user = {
		name: 'Alice',
		profile: {
			address: {
				city: 'NYC',
			},
			active: true,
		},
	};

	it('gets a top-level property', () => {
		expect(ObjectGetPropertyByPath(user, 'name')).toBe('Alice');
	});

	it('gets a nested property', () => {
		expect(ObjectGetPropertyByPath(user, 'profile.address.city')).toBe('NYC');
	});

	it('returns default value for missing path', () => {
		expect(ObjectGetPropertyByPath(user, 'profile.missing', 'default')).toBe('default');
	});

	it('returns undefined for missing path without default', () => {
		expect(ObjectGetPropertyByPath(user, 'profile.nonexistent')).toBeUndefined();
	});

	it('returns default for null object', () => {
		expect(ObjectGetPropertyByPath(null, 'a.b', 'fallback')).toBe('fallback');
	});

	it('returns default for empty path', () => {
		expect(ObjectGetPropertyByPath(user, '', 'fallback')).toBe('fallback');
	});

	it('blocks dangerous property access', () => {
		expect(ObjectGetPropertyByPath({}, '__proto__.polluted', 'safe')).toBe('safe');
	});
});

// ----- ObjectSortKeys -----

describe('ObjectSortKeys', () => {
	it('sorts object keys alphabetically', () => {
		const result = ObjectSortKeys({ z: 1, a: 3, m: 2 });
		expect(Object.keys(result)).toEqual(['a', 'm', 'z']);
	});

	it('preserves all values', () => {
		const result = ObjectSortKeys({ z: 1, a: 3 });
		expect(result.z).toBe(1);
		expect(result.a).toBe(3);
	});

	it('returns the input unchanged for null/array/non-object', () => {
		expect(ObjectSortKeys(null as any)).toBeNull();
		expect(ObjectSortKeys([] as any)).toEqual([]);
	});

	it('handles already-sorted keys', () => {
		const result = ObjectSortKeys({ a: 1, b: 2, c: 3 });
		expect(Object.keys(result)).toEqual(['a', 'b', 'c']);
	});
});

describe('ObjectToKeyValuePairs', () => {
	it('converts an object to key-value pairs', () => {
		expect(ObjectToKeyValuePairs({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]]);
	});

	it('returns empty array for empty object', () => {
		expect(ObjectToKeyValuePairs({})).toEqual([]);
	});

	it('round-trips with ObjectFromKeyValuePairs', () => {
		const obj = { x: 'foo', y: 'bar' };
		expect(ObjectFromKeyValuePairs(ObjectToKeyValuePairs(obj))).toEqual(obj);
	});
});

describe('ObjectInvert', () => {
	it('swaps keys and values', () => {
		expect(ObjectInvert({ a: 'x', b: 'y', c: 'z' })).toEqual({ x: 'a', y: 'b', z: 'c' });
	});

	it('works with numeric values', () => {
		const result = ObjectInvert({ read: 1, write: 2 } as Record<string, number>);
		expect(result[1]).toBe('read');
		expect(result[2]).toBe('write');
	});

	it('last write wins for duplicate values', () => {
		const result = ObjectInvert({ a: 'x', b: 'x' });
		expect(result['x']).toBe('b');
	});
});

describe('ObjectFlatten', () => {
	it('flattens a nested object with default separator', () => {
		expect(ObjectFlatten({ a: { b: { c: 1 }, d: 2 } })).toEqual({ 'a.b.c': 1, 'a.d': 2 });
	});

	it('uses a custom separator', () => {
		expect(ObjectFlatten({ a: { b: 1 } }, '/')).toEqual({ 'a/b': 1 });
	});

	it('treats arrays as leaf values', () => {
		expect(ObjectFlatten({ a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] });
	});

	it('treats Date instances as leaf values', () => {
		const d = new Date();
		expect(ObjectFlatten({ a: { b: d } })).toEqual({ 'a.b': d });
	});

	it('handles flat objects unchanged', () => {
		expect(ObjectFlatten({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
	});
});

describe('ObjectDiff', () => {
	it('detects added keys', () => {
		const result = ObjectDiff({ a: 1 }, { a: 1, b: 2 });
		expect(result.added).toEqual({ b: 2 });
		expect(result.removed).toEqual({});
		expect(result.changed).toEqual({});
	});

	it('detects removed keys', () => {
		const result = ObjectDiff({ a: 1, b: 2 }, { a: 1 });
		expect(result.removed).toEqual({ b: 2 });
	});

	it('detects changed keys', () => {
		const result = ObjectDiff({ a: 1, b: 2 }, { a: 1, b: 99 });
		expect(result.changed).toEqual({ b: { from: 2, to: 99 } });
	});

	it('returns all empty groups for identical objects', () => {
		const result = ObjectDiff({ a: 1 }, { a: 1 });
		expect(result).toEqual({ added: {}, removed: {}, changed: {} });
	});

	it('handles mixed changes', () => {
		const result = ObjectDiff({ a: 1, b: 2, c: 3 }, { b: 99, c: 3, d: 4 });
		expect(result.added).toEqual({ d: 4 });
		expect(result.removed).toEqual({ a: 1 });
		expect(result.changed).toEqual({ b: { from: 2, to: 99 } });
	});
});
