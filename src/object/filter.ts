import { ObjectEquals } from './equals.js';
import { isPropertyPathSafe } from './security-utils.js';
import type { IObjectFilterOptions, TPropertyFilter } from './types.js';

/**
 * Navigates to a nested property value using dot notation path
 *
 * @param object - The object to navigate
 * @param path - The dot notation path (e.g., 'meta.details.category')
 * @returns The value at the path, or undefined if path doesn't exist
 */
function objectGetValueByPath(object: any, path: string): any {
	const pathSegments = path.split('.');
	let current: any = object;

	for (const segment of pathSegments) {
		current = current?.[segment];
		if (current === undefined || current === null) {
			return undefined;
		}
	}

	return current;
}

/**
 * Compares two objects using deep equality logic for ObjectFilter
 *
 * @param objValue - The object value to compare
 * @param filterValue - The filter value to compare against
 * @param caseInsensitiveStrings - Whether to use case-insensitive string comparison
 * @returns True if the values match according to deep equality rules
 */
function objectDeepComparison(objValue: any, filterValue: any, caseInsensitiveStrings: boolean = false): boolean {
	// Handle string comparison with case insensitivity option
	if (caseInsensitiveStrings && typeof objValue === 'string' && typeof filterValue === 'string') {
		return objValue.toLowerCase() === filterValue.toLowerCase();
	}

	// Special handling for Date objects
	if (objValue instanceof Date && filterValue instanceof Date) {
		return objValue.getTime() === filterValue.getTime();
	}

	// Handle array cases: if objValue is an array, use array comparison logic
	if (Array.isArray(objValue)) {
		return objectHandleArrayComparison(objValue, filterValue, caseInsensitiveStrings, true);
	}

	// For deeply nested structures, check if filter is a subset of the object
	if (typeof objValue === 'object' && objValue !== null && typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
		return ObjectFilter(objValue, filterValue, { useDeepEqual: true, caseInsensitiveStrings });
	}

	// Default case: use full object equality
	return ObjectEquals(objValue, filterValue);
}

/**
 * Handles array filtering logic with support for string inclusion and subset matching
 *
 * @param objValue - The array value from the object
 * @param filterValue - The filter value to match against
 * @param caseInsensitiveStrings - Whether to use case-insensitive string comparison
 * @param useDeepEqual - Whether to use deep equality for nested objects
 * @returns True if the filter matches the array value
 */
function objectHandleArrayComparison(objValue: any[], filterValue: any, caseInsensitiveStrings: boolean, useDeepEqual: boolean): boolean {
	// If filterValue is a string, check if it exists in the array
	if (typeof filterValue === 'string') {
		if (caseInsensitiveStrings) {
			return objValue.some((item) => typeof item === 'string' && item.toLowerCase() === filterValue.toLowerCase());
		}

		return objValue.includes(filterValue);
	}

	// If filterValue is also an array, check if it's a subset
	if (Array.isArray(filterValue)) {
		return filterValue.every((item) => objValue.some((objItem) => objectCompareValues(objItem, item, caseInsensitiveStrings, useDeepEqual)));
	}

	// For non-string, non-array filter values, check direct inclusion
	return objValue.some((item) => objectCompareValues(item, filterValue, caseInsensitiveStrings, useDeepEqual));
}

/**
 * Compare values based on filter criteria
 *
 * @param objValue The object value
 * @param filterValue The filter value to compare against
 * @param caseInsensitiveStrings Whether to do case-insensitive string comparison
 * @param useDeepEqual Whether to use deep equality for nested objects
 * @returns True if values match according to specified criteria
 */
function objectCompareValues(objValue: any, filterValue: any, caseInsensitiveStrings: boolean, useDeepEqual = false): boolean {
	// Check if objValue is an array
	if (Array.isArray(objValue)) {
		return objectHandleArrayComparison(objValue, filterValue, caseInsensitiveStrings, useDeepEqual);
	}

	// Handle string comparison with case insensitivity option
	if (caseInsensitiveStrings && typeof objValue === 'string' && typeof filterValue === 'string') {
		return objValue.toLowerCase() === filterValue.toLowerCase();
	}

	// Special handling for NaN
	if (typeof objValue === 'number' && typeof filterValue === 'number' && isNaN(objValue) && isNaN(filterValue)) {
		return true;
	}

	// For object filtering with useDeepEqual, check if filterValue is a subset of objValue
	if (useDeepEqual && typeof objValue === 'object' && objValue !== null && typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
		return ObjectFilter(objValue, filterValue, { useDeepEqual: true, caseInsensitiveStrings });
	}

	// Use deep equality if requested
	if (useDeepEqual) {
		return ObjectEquals(objValue, filterValue);
	}

	// Default strict equality
	return objValue === filterValue;
}

/**
 * Filters an object based on a provided filter using flexible matching criteria.
 * Supports dot notation for nested properties, deep equality comparison, case-insensitive string matching,
 * and array inclusion/subset matching.
 *
 * @template T - The type of object being filtered
 * @param object - The object to filter
 * @param filter - The filter criteria to apply
 * @param options - Optional configuration for filtering behavior
 * @returns True if the object satisfies the filter, false otherwise
 *
 * @example
 * ```typescript
 * // Basic property matching
 * const user = { name: 'John', age: 30, active: true };
 * ObjectFilter(user, { name: 'John' }); // true
 * ObjectFilter(user, { age: 25 }); // false
 *
 * // Multiple properties (AND logic)
 * ObjectFilter(user, { name: 'John', active: true }); // true
 * ObjectFilter(user, { name: 'John', age: 25 }); // false
 *
 * // Dot notation for nested properties
 * const profile = {
 *   user: { name: 'John', details: { age: 30, city: 'NYC' } },
 *   meta: { created: '2023-01-01', active: true }
 * };
 * ObjectFilter(profile, { 'user.name': 'John' }); // true
 * ObjectFilter(profile, { 'user.details.city': 'NYC' }); // true
 * ObjectFilter(profile, { 'meta.active': true }); // true
 *
 * // Case-insensitive string matching
 * ObjectFilter(user, { name: 'john' }, { caseInsensitiveStrings: true }); // true
 * ObjectFilter(user, { name: 'JOHN' }, { caseInsensitiveStrings: true }); // true
 *
 * // Array matching - inclusion check
 * const post = { tags: ['javascript', 'typescript', 'node'], category: 'tech' };
 * ObjectFilter(post, { tags: 'javascript' }); // true (string in array)
 * ObjectFilter(post, { tags: 'python' }); // false
 *
 * // Array subset matching
 * ObjectFilter(post, { tags: ['javascript', 'typescript'] }); // true (subset)
 * ObjectFilter(post, { tags: ['javascript', 'python'] }); // false (not subset)
 *
 * // Deep equality for nested objects
 * const order = {
 *   items: [{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }],
 *   shipping: { address: { city: 'NYC', zip: '10001' } }
 * };
 * ObjectFilter(order,
 *   { shipping: { address: { city: 'NYC' } } },
 *   { useDeepEqual: true }
 * ); // true (partial match with deep equality)
 *
 * // Path validation (security)
 * ObjectFilter(profile, { '../malicious': 'value' }, { validatePaths: true }); // false
 * ObjectFilter(profile, { 'user..name': 'John' }, { validatePaths: true }); // false
 * ```
 */
export function ObjectFilter<T>(object: T, filter: Record<string, any>, options: IObjectFilterOptions = {}): boolean {
	// Default options
	const { useDeepEqual = false, caseInsensitiveStrings = false, validatePaths = false } = options;

	for (const key in filter) {
		// Skip properties that are not own properties of the filter object
		if (!Object.hasOwn(filter, key)) continue;

		// Handle dot notation paths
		if (key.includes('.')) {
			if (validatePaths && !isPropertyPathSafe(key)) {
				return false;
			}

			const objValue = objectGetValueByPath(object, key);
			if (objValue === undefined) {
				return false;
			}

			// Compare the values
			const filterValue = filter[key];
			if (useDeepEqual) {
				if (!objectDeepComparison(objValue, filterValue, caseInsensitiveStrings)) {
					return false;
				}
			} else if (!objectCompareValues(objValue, filterValue, caseInsensitiveStrings, useDeepEqual)) {
				return false;
			}
		} else {
			// Direct property comparison
			const objValue = (object as any)[key];
			const filterValue = filter[key];

			if (!(key in (object as any))) {
				return false;
			}

			if (useDeepEqual) {
				if (!objectDeepComparison(objValue, filterValue, caseInsensitiveStrings)) {
					return false;
				}
			} else if (!objectCompareValues(objValue, filterValue, caseInsensitiveStrings, useDeepEqual)) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Filters an object's properties using a predicate function.
 * Creates a new object containing only the properties for which the predicate returns true.
 *
 * @template T - The type of the source object
 * @param obj - The object to filter
 * @param predicate - A function that takes a property key and value, returning true to include the property
 * @returns A new object with only the filtered properties
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3, d: 4 };
 * const filtered = FilterObject(obj, (key, value) => value > 2);
 * // Result: { c: 3, d: 4 }
 *
 * // Type-safe filtering
 * interface User { id: number; name: string; age: number; }
 * const user: User = { id: 1, name: 'John', age: 30 };
 * const publicData = FilterObject(user, (key, value) => key !== 'age');
 * // Result: { id: 1, name: 'John' }
 * ```
 */
export function FilterObject<T extends object>(obj: T, predicate: TPropertyFilter<T>): Partial<T> {
	if (!obj || typeof obj !== 'object') {
		return {};
	}

	const result: Partial<T> = {};

	for (const key in obj) {
		if (Object.hasOwn(obj, key)) {
			const value = obj[key];
			if (predicate(key as keyof T, value)) {
				result[key] = value;
			}
		}
	}

	return result;
}
