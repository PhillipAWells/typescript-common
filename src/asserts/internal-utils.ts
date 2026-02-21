/**
 * @fileoverview Internal utilities for the asserts package.
 * These utilities are copied from @jtv/common to make @jtv/asserts standalone.
 */

/**
 * A constructor function type for creating objects of type O.
 * @template O The object type to construct.
 */
export type TConstructableObject<O extends object = object> = new (...args: any[]) => O;

/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 * Handles primitives, objects, arrays, dates, regular expressions, and special values like NaN.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if the values are equivalent, false otherwise
 *
 * @example
 * ```typescript
 * // Primitive values
 * ObjectEquals(42, 42); // true
 * ObjectEquals('hello', 'hello'); // true
 * ObjectEquals(true, false); // false
 *
 * // Objects
 * ObjectEquals({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * ObjectEquals({ a: 1, b: 2 }, { a: 1, b: 3 }); // false
 *
 * // Nested objects
 * const obj1 = { user: { name: 'John', age: 30 }, active: true };
 * const obj2 = { user: { name: 'John', age: 30 }, active: true };
 * ObjectEquals(obj1, obj2); // true
 *
 * // Arrays
 * ObjectEquals([1, 2, 3], [1, 2, 3]); // true
 * ObjectEquals([1, [2, 3]], [1, [2, 3]]); // true
 *
 * // Date objects
 * const date1 = new Date('2023-01-01');
 * const date2 = new Date('2023-01-01');
 * ObjectEquals(date1, date2); // true
 *
 * // Regular expressions
 * ObjectEquals(/abc/g, /abc/g); // true
 * ObjectEquals(/abc/g, /abc/i); // false
 *
 * // Special cases
 * ObjectEquals(NaN, NaN); // true (unlike === comparison)
 * ObjectEquals(null, undefined); // false
 * ```
 */
export function ObjectEquals(a: any, b: any): boolean {
	// If the values are strictly equal, return true
	if (a === b) return true;

	// Handle NaN special case - NaN should equal NaN for assertion purposes
	if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) {
		return true;
	}

	// If either value is null, undefined, or not an object, they can't be equivalent
	if (a === null || b === null || a === undefined || b === undefined) return false;

	if (typeof a !== typeof b) return false;

	if (typeof a !== 'object') return false;

	// Handle Date objects
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}

	// Handle RegExp objects
	if (a instanceof RegExp && b instanceof RegExp) {
		return a.toString() === b.toString();
	}

	// Handle arrays
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;

		// Compare each element in the arrays
		for (let i = 0; i < a.length; i++) {
			if (!ObjectEquals(a[i], b[i])) return false;
		}

		return true;
	}

	// If one is array and the other isn't, they're not equal
	if (Array.isArray(a) !== Array.isArray(b)) return false;

	// Compare object properties
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) return false;

	// Also compare symbol properties
	const symbolsA = Object.getOwnPropertySymbols(a);
	const symbolsB = Object.getOwnPropertySymbols(b);

	if (symbolsA.length !== symbolsB.length) return false;

	for (const key of keysA) {
		if (!Object.hasOwn(b, key)) return false;
		if (!ObjectEquals(a[key], b[key])) return false;
	}

	for (const symbol of symbolsA) {
		if (!Object.getOwnPropertySymbols(b).includes(symbol)) return false;
		if (!ObjectEquals(a[symbol], b[symbol])) return false;
	}

	return true;
}
