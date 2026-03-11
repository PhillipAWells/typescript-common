import { describe, it, expect, vi } from 'vitest';
import { IsObject } from './assert-object.js';
import { ObjectClone } from './clone.js';
import { ObjectEquals } from './equals.js';
import { ObjectFilter, FilterObject } from './filter.js';
import { ObjectFilterCached } from './filter-cached.js';
import { ObjectHasCircularReference } from './has-circular-reference.js';
import { ObjectHash } from './hash.js';
import { ObjectFromKeyValuePairs, ObjectToKeyValuePairs } from './key-value-pairs.js';
import { MapObject } from './map.js';
import { MapObjectCached } from './map-cached.js';
import { ObjectMerge } from './merge.js';
import { ObjectOmit } from './omit.js';
import { ObjectPick } from './pick.js';
import { ObjectGetPropertyByPath, ObjectSetPropertyByPath } from './property-paths.js';
import { ObjectSortKeys } from './sort-keys.js';
import { ObjectInvert } from './object-invert.js';
import { ObjectFlatten } from './object-flatten.js';
import { ObjectDiff } from './object-diff.js';
import { CreateJsonCircularReplacer } from './json-circular-replacer.js';

// ----- IsObject -----

describe('IsObject', () => {
	it('returns true for a plain object', () => {
		expect(IsObject({ a: 1 })).toBe(true);
	});

	it('returns false for null', () => {
		expect(IsObject(null)).toBe(false);
	});

	it('returns false for arrays', () => {
		expect(IsObject([1, 2, 3])).toBe(false);
	});

	it('returns false for primitives', () => {
		expect(IsObject(42)).toBe(false);
		expect(IsObject('string')).toBe(false);
		expect(IsObject(true)).toBe(false);
	});

	it('returns true for empty object', () => {
		expect(IsObject({})).toBe(true);
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

	it('returns empty object for null/invalid cursor', async () => {
		const mapFn = MapObjectCached<{ a: number }>();
		const result = await mapFn(null as any, (_, v) => v);
		expect(result).toEqual({});
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

// ----- ObjectHasCircularReference (shared-reference regression) -----

describe('ObjectHasCircularReference (DAG)', () => {
	it('returns false for objects sharing the same sub-object', () => {
		const shared = { x: 1 };
		expect(ObjectHasCircularReference({ a: shared, b: shared })).toBe(false);
	});

	it('returns false for objects sharing the same array', () => {
		const arr = [1, 2, 3];
		expect(ObjectHasCircularReference({ x: arr, y: arr })).toBe(false);
	});

	it('still returns true for genuine circular references', () => {
		const obj: any = { a: 1 };
		obj.self = obj;
		expect(ObjectHasCircularReference(obj)).toBe(true);
	});
});

// ----- ObjectClone (shared-reference regression) -----

describe('ObjectClone (DAG)', () => {
	it('clones an object whose Date appears at multiple keys without throwing', () => {
		const d = new Date('2024-01-01');
		const obj = { created: d, updated: d };
		expect(() => ObjectClone(obj)).not.toThrow();
		const cloned = ObjectClone(obj);
		expect(cloned.created).toEqual(d);
		expect(cloned.updated).toEqual(d);
		expect(cloned.created).not.toBe(d);
	});

	it('clones an object whose nested object appears at multiple keys without throwing', () => {
		const meta = { version: 1 };
		const obj = { a: meta, b: meta };
		expect(() => ObjectClone(obj)).not.toThrow();
		const cloned = ObjectClone(obj);
		expect(cloned.a).toEqual(meta);
		expect(cloned.b).toEqual(meta);
	});
});

// ----- ObjectFilter (extended) -----

describe('ObjectFilter (extended)', () => {
	it('matches a null value at a nested path', () => {
		const obj = { user: { address: null } };
		expect(ObjectFilter(obj, { 'user.address': null })).toBe(true);
	});

	it('does not match a non-null value against null at a nested path', () => {
		const obj = { user: { address: 'somewhere' } };
		expect(ObjectFilter(obj, { 'user.address': null })).toBe(false);
	});

	it('returns false when an intermediate path segment is null', () => {
		const obj = { user: null };
		expect(ObjectFilter(obj as any, { 'user.name': 'Alice' })).toBe(false);
	});

	it('checks string inclusion in an array value', () => {
		const obj = { tags: ['javascript', 'typescript'] };
		expect(ObjectFilter(obj, { tags: 'javascript' })).toBe(true);
		expect(ObjectFilter(obj, { tags: 'python' })).toBe(false);
	});

	it('checks array subset matching', () => {
		const obj = { tags: ['javascript', 'typescript', 'node'] };
		expect(ObjectFilter(obj, { tags: ['javascript', 'typescript'] })).toBe(true);
		expect(ObjectFilter(obj, { tags: ['javascript', 'python'] })).toBe(false);
	});

	it('checks non-string value inclusion in array', () => {
		const obj = { scores: [1, 2, 3] };
		expect(ObjectFilter(obj, { scores: 2 })).toBe(true);
		expect(ObjectFilter(obj, { scores: 5 })).toBe(false);
	});

	it('matches nested objects with useDeepEqual', () => {
		const obj = { meta: { type: 'user', active: true } };
		expect(ObjectFilter(obj, { meta: { type: 'user' } }, { useDeepEqual: true })).toBe(true);
		expect(ObjectFilter(obj, { meta: { type: 'admin' } }, { useDeepEqual: true })).toBe(false);
	});

	it('returns false for missing direct properties', () => {
		expect(ObjectFilter({ a: 1 }, { b: 1 })).toBe(false);
	});

	it('blocks invalid paths when validatePaths is true', () => {
		expect(ObjectFilter({ a: 1 }, { '../malicious': 1 }, { validatePaths: true })).toBe(false);
		expect(ObjectFilter({ a: 1 }, { 'a..b': 1 }, { validatePaths: true })).toBe(false);
	});

	it('handles NaN filter values matched in arrays', () => {
		const obj = { scores: [NaN, 1, 2] };
		expect(ObjectFilter(obj, { scores: NaN })).toBe(true);
	});

	it('matches array of objects with useDeepEqual (subset matching)', () => {
		// This exercises objectCompareValues with objects when useDeepEqual = true
		const obj = { items: [{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }] };
		expect(ObjectFilter(obj, { items: [{ id: 1 }] }, { useDeepEqual: true })).toBe(true);
		expect(ObjectFilter(obj, { items: [{ id: 99 }] }, { useDeepEqual: true })).toBe(false);
	});

	it('matches nested objects via dot notation with useDeepEqual', () => {
		// This exercises the dot-notation + useDeepEqual branch in ObjectFilter
		const obj = { user: { details: { role: 'admin', active: true } } };
		expect(ObjectFilter(obj, { 'user.details': { role: 'admin' } }, { useDeepEqual: true })).toBe(true);
		expect(ObjectFilter(obj, { 'user.details': { role: 'guest' } }, { useDeepEqual: true })).toBe(false);
	});

	it('case-insensitive match in string arrays', () => {
		const obj = { tags: ['JavaScript', 'TypeScript'] };
		expect(ObjectFilter(obj, { tags: 'javascript' }, { caseInsensitiveStrings: true })).toBe(true);
	});
});

// ----- FilterObject -----

describe('FilterObject', () => {
	it('keeps properties where predicate returns true', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(FilterObject(obj, (_, v) => (v as number) > 1)).toEqual({ b: 2, c: 3 });
	});

	it('filters by key', () => {
		const obj = { name: 'Alice', age: 30 };
		expect(FilterObject(obj, (k) => k === 'name')).toEqual({ name: 'Alice' });
	});

	it('returns empty object when no properties match', () => {
		expect(FilterObject({ a: 1, b: 2 }, () => false)).toEqual({});
	});

	it('returns empty object for null/invalid input', () => {
		expect(FilterObject(null as any, () => true)).toEqual({});
	});

	it('returns all properties when predicate always returns true', () => {
		const obj = { x: 10, y: 20 };
		expect(FilterObject(obj, () => true)).toEqual({ x: 10, y: 20 });
	});
});

// ----- ObjectSetPropertyByPath -----

describe('ObjectSetPropertyByPath', () => {
	it('sets a simple nested property, creating intermediates', () => {
		const obj: any = { name: 'Alice' };
		ObjectSetPropertyByPath(obj, 'profile.age', 30);
		expect(obj.profile.age).toBe(30);
	});

	it('sets a deeply nested property', () => {
		const obj: any = {};
		ObjectSetPropertyByPath(obj, 'a.b.c', 42);
		expect(obj.a.b.c).toBe(42);
	});

	it('overwrites an existing top-level property', () => {
		const obj: any = { value: 1 };
		ObjectSetPropertyByPath(obj, 'value', 2);
		expect(obj.value).toBe(2);
	});

	it('overwrites an existing nested property', () => {
		const obj: any = { user: { name: 'Alice' } };
		ObjectSetPropertyByPath(obj, 'user.name', 'Bob');
		expect(obj.user.name).toBe('Bob');
	});

	it('replaces a non-object intermediate with a new object', () => {
		const obj: any = { a: 42 };
		ObjectSetPropertyByPath(obj, 'a.b', 'hello');
		expect(obj.a.b).toBe('hello');
	});

	it('safely ignores a null/undefined target object', () => {
		expect(() => ObjectSetPropertyByPath(null as any, 'a.b', 1)).not.toThrow();
	});

	it('safely ignores an empty path', () => {
		const obj: any = {};
		expect(() => ObjectSetPropertyByPath(obj, '', 1)).not.toThrow();
		expect(obj).toEqual({});
	});

	it('blocks prototype pollution via __proto__', () => {
		const obj: any = {};
		ObjectSetPropertyByPath(obj, '__proto__.polluted', true);
		expect(({} as any).polluted).toBeUndefined();
	});

	it('blocks prototype pollution via constructor.prototype', () => {
		const obj: any = {};
		ObjectSetPropertyByPath(obj, 'constructor.prototype.evil', true);
		expect((obj as any).evil).toBeUndefined();
	});
});

// ----- ObjectGetPropertyByPath (extended) -----

describe('ObjectGetPropertyByPath (extended)', () => {
	it('returns undefined when an intermediate segment value is a primitive', () => {
		// obj.a is a number, so obj.a.b cannot exist as an own property
		expect(ObjectGetPropertyByPath({ a: 5 }, 'a.b')).toBeUndefined();
	});

	it('returns null when the target property value is null', () => {
		expect(ObjectGetPropertyByPath({ a: { b: null } }, 'a.b')).toBeNull();
	});

	it('returns default when path contains a dangerous segment', () => {
		expect(ObjectGetPropertyByPath({}, '__proto__.constructor', 'safe')).toBe('safe');
	});

	it('returns default for a path with consecutive dots', () => {
		expect(ObjectGetPropertyByPath({ a: 1 }, 'a..b', 'fallback')).toBe('fallback');
	});
});

// ----- CreateJsonCircularReplacer -----

describe('CreateJsonCircularReplacer', () => {
	it('serializes a simple object without modification', () => {
		const obj = { a: 1, b: 'hello', c: true };
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":1,"b":"hello","c":true}');
	});

	it('serializes nested objects without modification', () => {
		const obj = { a: { b: { c: 1 } } };
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":{"b":{"c":1}}}');
	});

	it('handles circular reference to self', () => {
		const obj: any = { a: 1 };
		obj.self = obj;
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":1,"self":"[Circular]"}');
	});

	it('handles deeply nested circular reference', () => {
		const obj: any = { a: { b: { c: {} } } };
		obj.a.b.c.root = obj;
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":{"b":{"c":{"root":"[Circular]"}}}}');
	});

	it('handles circular reference in array', () => {
		const obj: any = { items: [] };
		obj.items.push(obj);
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"items":["[Circular]"]}');
	});

	it('allows shared references (DAG) that are not circular', () => {
		const shared = { x: 1 };
		const obj = { a: shared, b: shared };
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":{"x":1},"b":{"x":1}}');
	});

	it('allows shared arrays that are not circular', () => {
		const arr = [1, 2, 3];
		const obj = { x: arr, y: arr };
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"x":[1,2,3],"y":[1,2,3]}');
	});

	it('uses custom placeholder string', () => {
		const obj: any = { a: 1 };
		obj.self = obj;
		const result = JSON.stringify(obj, CreateJsonCircularReplacer('[Ref]'));
		expect(result).toBe('{"a":1,"self":"[Ref]"}');
	});

	it('handles null values', () => {
		const obj = { a: null, b: 1 };
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":null,"b":1}');
	});

	it('handles arrays with primitives', () => {
		const obj = { arr: [1, 'two', null, true] };
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"arr":[1,"two",null,true]}');
	});

	it('handles multiple circular references at different levels', () => {
		const obj: any = { a: {} };
		obj.a.parent = obj;
		obj.self = obj;
		const result = JSON.stringify(obj, CreateJsonCircularReplacer());
		expect(result).toBe('{"a":{"parent":"[Circular]"},"self":"[Circular]"}');
	});

	it('each replacer instance is independent', () => {
		const obj1: any = { id: 1 };
		obj1.self = obj1;
		const obj2: any = { id: 2 };
		obj2.self = obj2;

		const replacer1 = CreateJsonCircularReplacer();
		const replacer2 = CreateJsonCircularReplacer();

		const result1 = JSON.stringify(obj1, replacer1);
		const result2 = JSON.stringify(obj2, replacer2);

		expect(result1).toBe('{"id":1,"self":"[Circular]"}');
		expect(result2).toBe('{"id":2,"self":"[Circular]"}');
	});
});
