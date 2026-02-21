/**
 * Object utility functions and types.
 *
 * Provides helpers for cloning, comparing, filtering, mapping, merging,
 * picking, omitting, hashing, and traversing plain objects.  Security-hardened
 * implementations guard against prototype-pollution and path-traversal attacks.
 *
 * @module object
 */

// Functions
export { ObjectHasCircularReference } from './has-circular-reference.js';
export { ObjectClone, TransformObject } from './clone.js';
export { ObjectEquals } from './equals.js';
export { ObjectFilter, FilterObject } from './filter.js';
export { ObjectFilterCached } from './filter-cached.js';
export { MapObject } from './map.js';
export { MapObjectCached } from './map-cached.js';
export { ObjectHash } from './hash.js';
export { ObjectGetPropertyByPath, ObjectSetPropertyByPath } from './property-paths.js';
export { ObjectSortKeys } from './sort-keys.js';
export { ObjectFromKeyValuePairs, ObjectToKeyValuePairs } from './key-value-pairs.js';
export { ObjectPick } from './pick.js';
export { ObjectOmit } from './omit.js';
export { ObjectMerge } from './merge.js';
export { AssertObject } from './assert-object.js';
export { isPropertyKeySafe, isPropertyPathSafe, sanitizePropertyKey, filterDangerousKeys, createCircularReferenceDetector, isInputSafe } from './security-utils.js';
export { ObjectInvert } from './object-invert.js';
export { ObjectFlatten } from './object-flatten.js';
export { ObjectDiff } from './object-diff.js';
export { ObjectError, ObjectPropertyError, AssertObjectHasProperty, AssertObjectHasOwnProperty, AssertObjectPropertyNotNull } from './assert.js';
export type { IObjectDiffResult } from './object-diff.js';

// Types
export type { TConstructableObject, TObjectOmitExtraProperties, TCachedObjectFilterFunction, TCachedObjectMapperFunction, TObjectPredicate, TObjectTransformer, TObjectComparator, TObjectEqualityComparator, TPropertyMapper, TPropertyFilter } from './types.js';

// Interfaces
export type { IObjectFilterOptions, ICachedObjectFilterOptions, ICachedObjectMapOptions } from './types.js';
