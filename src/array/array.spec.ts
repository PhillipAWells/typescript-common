import { describe, it, expect } from 'vitest';
import { ArrayChunk } from './array-chunk.js';
import { ArrayContains } from './array-contains.js';
import { ArrayFilter } from './array-filter.js';
import { ArrayGroupBy } from './array-group-by.js';
import { ArrayIntersection } from './array-intersection.js';
import { ArrayShuffle } from './array-shuffle.js';
import { Unique } from './unique.js';
import { ArrayDifference } from './array-difference.js';
import { ArrayFlatten } from './array-flatten.js';
import { ArrayCompact } from './array-compact.js';
import { ArrayPartition } from './array-partition.js';
import { ArrayZip } from './array-zip.js';
import { ArrayRange } from './array-range.js';
import { ArraySortBy } from './array-sort-by.js';
import { ArrayCountBy } from './array-count-by.js';
import { ArraySample } from './array-sample.js';

describe('ArrayChunk', () => {
	it('splits an array into equal-size chunks', () => {
		expect(ArrayChunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
	});

	it('handles a remainder chunk', () => {
		expect(ArrayChunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	it('returns the whole array in one chunk when size >= length', () => {
		expect(ArrayChunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
	});

	it('returns empty array for empty input', () => {
		expect(ArrayChunk([], 2)).toEqual([]);
	});

	it('returns empty array for size <= 0', () => {
		expect(ArrayChunk([1, 2, 3], 0)).toEqual([]);
		expect(ArrayChunk([1, 2, 3], -1)).toEqual([]);
	});

	it('returns empty array for null/undefined input', () => {
		expect(ArrayChunk(null as any, 2)).toEqual([]);
	});

	it('handles chunk size of 1', () => {
		expect(ArrayChunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
	});
});

describe('ArrayContains', () => {
	it('returns true when an element passes the predicate', () => {
		expect(ArrayContains([1, 2, 3], (x) => x > 2)).toBe(true);
	});

	it('returns false when no element passes the predicate', () => {
		expect(ArrayContains([1, 2, 3], (x) => x > 10)).toBe(false);
	});

	it('returns false for an empty array', () => {
		expect(ArrayContains([], () => true)).toBe(false);
	});

	it('returns false for null/undefined input', () => {
		expect(ArrayContains(null as any, () => true)).toBe(false);
	});

	it('works with object arrays', () => {
		const users = [{ name: 'Alice' }, { name: 'Bob' }];
		expect(ArrayContains(users, (u) => u.name === 'Bob')).toBe(true);
		expect(ArrayContains(users, (u) => u.name === 'Charlie')).toBe(false);
	});
});

describe('ArrayFilter', () => {
	it('filters using a predicate function', () => {
		expect(ArrayFilter([1, 2, 3, 4], (n) => n > 2)).toEqual([3, 4]);
	});

	it('filters using object criteria', () => {
		const users = [
			{ name: 'Alice', age: 25 },
			{ name: 'Bob', age: 30 },
		];
		expect(ArrayFilter(users, { age: 30 })).toEqual([{ name: 'Bob', age: 30 }]);
	});

	it('filters using nested property criteria', () => {
		const data = [
			{ user: { name: 'Alice', active: true } },
			{ user: { name: 'Bob', active: false } },
		];
		expect(ArrayFilter(data, { 'user.name': 'Alice' })).toEqual([data[0]]);
	});

	it('filters using array property criteria', () => {
		const posts = [
			{ tags: ['js', 'web'] },
			{ tags: ['ts', 'node'] },
		];
		expect(ArrayFilter(posts, { tags: 'js' })).toEqual([posts[0]]);
	});

	it('returns empty array when nothing matches', () => {
		expect(ArrayFilter([1, 2, 3], (n) => n > 100)).toEqual([]);
	});

	it('returns all elements when everything matches', () => {
		expect(ArrayFilter([1, 2, 3], (n) => n > 0)).toEqual([1, 2, 3]);
	});

	it('handles multiple criteria keys', () => {
		const users = [
			{ name: 'Alice', role: 'admin' },
			{ name: 'Bob', role: 'user' },
			{ name: 'Alice', role: 'user' },
		];
		expect(ArrayFilter(users, { name: 'Alice', role: 'admin' })).toEqual([users[0]]);
	});
});

describe('ArrayGroupBy', () => {
	it('groups by a string key', () => {
		const items = [
			{ category: 'fruit', name: 'apple' },
			{ category: 'veggie', name: 'carrot' },
			{ category: 'fruit', name: 'banana' },
		];
		const grouped = ArrayGroupBy(items, (item) => item.category);
		expect(grouped['fruit']).toHaveLength(2);
		expect(grouped['veggie']).toHaveLength(1);
	});

	it('returns an empty object for an empty array', () => {
		expect(ArrayGroupBy([], (x) => x)).toEqual({});
	});

	it('returns empty object for null input', () => {
		expect(ArrayGroupBy(null as any, (x) => x as string)).toEqual({});
	});

	it('groups numbers', () => {
		const result = ArrayGroupBy([1, 2, 3, 4, 5, 6], (n) => (n % 2 === 0 ? 'even' : 'odd'));
		expect(result['even']).toEqual([2, 4, 6]);
		expect(result['odd']).toEqual([1, 3, 5]);
	});
});

describe('ArrayIntersection', () => {
	it('returns elements in both arrays', () => {
		expect(ArrayIntersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
	});

	it('returns empty when there is no overlap', () => {
		expect(ArrayIntersection([1, 2], [3, 4])).toEqual([]);
	});

	it('handles empty arrays', () => {
		expect(ArrayIntersection([], [1, 2])).toEqual([]);
		expect(ArrayIntersection([1, 2], [])).toEqual([]);
	});

	it('handles null inputs', () => {
		expect(ArrayIntersection(null as any, [1, 2])).toEqual([]);
		expect(ArrayIntersection([1, 2], null as any)).toEqual([]);
	});

	it('uses a custom comparator', () => {
		const a = [{ id: 1 }, { id: 2 }];
		const b = [{ id: 2 }, { id: 3 }];
		const result = ArrayIntersection(a, b, (x, y) => x.id === y.id);
		expect(result).toEqual([{ id: 2 }]);
	});

	it('handles duplicates using set deduplication', () => {
		expect(ArrayIntersection([1, 1, 2], [1, 2, 2])).toEqual([1, 1, 2]);
	});
});

describe('ArrayShuffle', () => {
	it('returns a new array with the same elements', () => {
		const original = [1, 2, 3, 4, 5];
		const shuffled = ArrayShuffle(original);
		expect(shuffled).toHaveLength(original.length);
		expect(shuffled.sort()).toEqual([...original].sort());
	});

	it('does not mutate the original array', () => {
		const original = [1, 2, 3];
		const copy = [...original];
		ArrayShuffle(original);
		expect(original).toEqual(copy);
	});

	it('returns empty array for null input', () => {
		expect(ArrayShuffle(null as any)).toEqual([]);
	});

	it('handles single-element arrays', () => {
		expect(ArrayShuffle([42])).toEqual([42]);
	});

	it('handles empty arrays', () => {
		expect(ArrayShuffle([])).toEqual([]);
	});
});

describe('Unique', () => {
	it('removes duplicate primitives', () => {
		expect(Unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
	});

	it('removes duplicate strings', () => {
		expect(Unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
	});

	it('returns the same array when no duplicates', () => {
		expect(Unique([1, 2, 3])).toEqual([1, 2, 3]);
	});

	it('returns empty array for empty input', () => {
		expect(Unique([])).toEqual([]);
	});

	it('returns empty array for null input', () => {
		expect(Unique(null as any)).toEqual([]);
	});

	it('uses reference equality for objects', () => {
		const obj = { a: 1 };
		expect(Unique([obj, obj])).toEqual([obj]);
		expect(Unique([{ a: 1 }, { a: 1 }])).toHaveLength(2);
	});
});

describe('ArrayDifference', () => {
	it('returns elements in first array not in second', () => {
		expect(ArrayDifference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
	});

	it('returns a copy of array1 when array2 is empty', () => {
		expect(ArrayDifference([1, 2, 3], [])).toEqual([1, 2, 3]);
	});

	it('returns empty when all elements are excluded', () => {
		expect(ArrayDifference([1, 2], [1, 2, 3])).toEqual([]);
	});

	it('uses a custom comparator', () => {
		const a = [{ id: 1 }, { id: 2 }];
		const b = [{ id: 2 }];
		expect(ArrayDifference(a, b, (x, y) => x.id === y.id)).toEqual([{ id: 1 }]);
	});

	it('returns empty for null input', () => {
		expect(ArrayDifference(null as any, [1])).toEqual([]);
	});
});

describe('ArrayFlatten', () => {
	it('flattens one level by default', () => {
		expect(ArrayFlatten([1, [2, [3]]])).toEqual([1, 2, 3]);
	});

	it('flattens to a specified depth', () => {
		expect(ArrayFlatten([1, [2, [3, [4]]]], 1)).toEqual([1, 2, [3, [4]]]);
	});

	it('handles already-flat arrays', () => {
		expect(ArrayFlatten([1, 2, 3])).toEqual([1, 2, 3]);
	});

	it('returns empty for null input', () => {
		expect(ArrayFlatten(null as any)).toEqual([]);
	});
});

describe('ArrayCompact', () => {
	it('removes null and undefined', () => {
		expect(ArrayCompact([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
	});

	it('keeps falsy-but-defined values like 0 and empty string', () => {
		expect(ArrayCompact([0, '', false, null, undefined] as (number | string | boolean | null | undefined)[])).toEqual([0, '', false]);
	});

	it('returns empty for null input', () => {
		expect(ArrayCompact(null as any)).toEqual([]);
	});
});

describe('ArrayPartition', () => {
	it('splits into matches and non-matches', () => {
		const [evens, odds] = ArrayPartition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
		expect(evens).toEqual([2, 4]);
		expect(odds).toEqual([1, 3, 5]);
	});

	it('handles all matching', () => {
		const [t, f] = ArrayPartition([2, 4], (n) => n % 2 === 0);
		expect(t).toEqual([2, 4]);
		expect(f).toEqual([]);
	});

	it('handles no matches', () => {
		const [t, f] = ArrayPartition([1, 3], (n) => n % 2 === 0);
		expect(t).toEqual([]);
		expect(f).toEqual([1, 3]);
	});

	it('returns [[], []] for null input', () => {
		expect(ArrayPartition(null as any, () => true)).toEqual([[], []]);
	});
});

describe('ArrayZip', () => {
	it('zips two arrays', () => {
		expect(ArrayZip([1, 2, 3], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
	});

	it('stops at the shortest array', () => {
		expect(ArrayZip([1, 2, 3], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']]);
	});

	it('zips three arrays', () => {
		expect(ArrayZip([1, 2], ['a', 'b'], [true, false])).toEqual([[1, 'a', true], [2, 'b', false]]);
	});

	it('returns empty for no arguments', () => {
		expect(ArrayZip()).toEqual([]);
	});
});

describe('ArrayRange', () => {
	it('generates ascending range', () => {
		expect(ArrayRange(0, 5)).toEqual([0, 1, 2, 3, 4]);
	});

	it('generates range with step', () => {
		expect(ArrayRange(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
	});

	it('generates descending range', () => {
		expect(ArrayRange(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
	});

	it('returns empty for step of 0', () => {
		expect(ArrayRange(0, 5, 0)).toEqual([]);
	});

	it('returns empty when start >= end for positive step', () => {
		expect(ArrayRange(5, 5)).toEqual([]);
		expect(ArrayRange(6, 5)).toEqual([]);
	});
});

describe('ArraySortBy', () => {
	it('sorts objects by a string key ascending', () => {
		const result = ArraySortBy([{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }], (u) => u.name);
		expect(result.map((u) => u.name)).toEqual(['Alice', 'Bob', 'Charlie']);
	});

	it('sorts numbers descending', () => {
		expect(ArraySortBy<number>([3, 1, 4, 1, 5], (n) => n, 'desc')).toEqual([5, 4, 3, 1, 1]);
	});

	it('does not mutate the original', () => {
		const original = [3, 1, 2];
		const sorted = ArraySortBy(original, (n) => n);
		expect(original).toEqual([3, 1, 2]);
		expect(sorted).toEqual([1, 2, 3]);
	});

	it('returns empty for null input', () => {
		expect(ArraySortBy<number>(null as any, (_n) => 0)).toEqual([]);
	});
});

describe('ArrayCountBy', () => {
	it('counts by string key', () => {
		const result = ArrayCountBy<string, string>(['a', 'b', 'a', 'c', 'b', 'b'], (s) => s);
		expect(result).toEqual({ a: 2, b: 3, c: 1 });
	});

	it('counts by computed key', () => {
		const result = ArrayCountBy([1, 2, 3, 4, 5, 6], (n) => (n % 2 === 0 ? 'even' : 'odd'));
		expect(result).toEqual({ even: 3, odd: 3 });
	});

	it('returns empty object for null input', () => {
		expect(ArrayCountBy<string, string>(null as any, (_n) => '')).toEqual({});
	});
});

describe('ArraySample', () => {
	it('returns a single element within the array', () => {
		const arr = [1, 2, 3, 4, 5];
		const result = ArraySample(arr);
		expect(arr).toContain(result);
	});

	it('returns undefined for empty array', () => {
		expect(ArraySample([])).toBeUndefined();
	});

	it('returns n elements', () => {
		const arr = [1, 2, 3, 4, 5];
		const result = ArraySample(arr, 3);
		expect(result).toHaveLength(3);
		result.forEach((v) => expect(arr).toContain(v));
	});

	it('returns no more than array length', () => {
		expect(ArraySample([1, 2], 10)).toHaveLength(2);
	});

	it('returns no duplicates when sampling n', () => {
		const result = ArraySample([1, 2, 3, 4, 5], 5);
		expect(new Set(result).size).toBe(5);
	});

	it('returns empty array when n=0', () => {
		expect(ArraySample([1, 2, 3], 0)).toEqual([]);
	});
});
