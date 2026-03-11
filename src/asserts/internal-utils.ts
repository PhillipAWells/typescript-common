/**
 * @fileoverview Internal utilities for the asserts package.
 */

/**
 * A constructor function type for creating objects of type O.
 * @template O The object type to construct.
 */
export type TConstructableObject<O extends object = object> = new (...args: any[]) => O;

// Single source of truth — the canonical implementation lives in the object module.
export { ObjectEquals } from '../object/equals.js';
