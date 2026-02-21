/**
 * Array utility functions.
 *
 * Provides helpers for chunking, filtering, grouping, shuffling, intersecting,
 * and deduplicating arrays to complement the JavaScript built-ins.
 *
 * @module array
 */

export * from './array-filter.js';
export * from './array-contains.js';
export * from './unique.js';
export * from './array-intersection.js';
export * from './array-chunk.js';
export * from './array-shuffle.js';
export * from './array-group-by.js';
export * from './array-difference.js';
export * from './array-flatten.js';
export * from './array-compact.js';
export * from './array-partition.js';
export * from './array-zip.js';
export * from './array-range.js';
export * from './array-sort-by.js';
export * from './array-count-by.js';
export * from './array-sample.js';
export type * from './array-element.js';
export type { TPredicate, TTransform, TComparator, TEqualityComparator } from './types.js';
export * from './assert.js';
