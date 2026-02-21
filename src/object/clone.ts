import { filterDangerousKeys } from './security-utils.js';
import type { TObjectTransformer } from './types.js';

/**
 * Creates a deep clone of an object with security protections.
 *
 * **Security Features:**
 * - Prevents infinite recursion with circular reference detection.
 * - Filters out dangerous properties that could cause prototype pollution.
 * - Safely handles complex object structures.
 *
 * @template T - The type of the object to clone
 * @param obj - Object to clone
 * @param visitedInput - Internal WeakSet used to detect circular references (do not pass manually)
 * @returns Deep clone of the object
 * @throws {Error} When `obj` contains circular references.
 * @throws {Error} When `obj` is a function, symbol, `Map`, `Set`, `WeakMap`, or a class instance.
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const clone = ObjectClone(original);
 * clone.b.c = 99;
 * console.log(original.b.c); // 2  (original is not affected)
 * ```
 */
export function ObjectClone<T>(obj: T, visitedInput?: WeakSet<object>): T {
	if (obj === null || obj === undefined) {
		return obj;
	}

	// Initialize circular reference detector on first call
	const visited = visitedInput ?? new WeakSet();

	// Only check for circular references in objects
	if (typeof obj === 'object' && obj !== null) {
		// Check for circular reference
		if (visited.has(obj)) {
			throw new Error('ObjectClone: Circular reference detected, cannot clone object with circular references');
		}

		// Mark this object as visited
		visited.add(obj);
	}

	// Handle Date
	if (obj instanceof Date) {
		return new Date(obj.getTime()) as unknown as T;
	}

	// Handle Array
	if (Array.isArray(obj)) {
		return obj.map((item) => ObjectClone(item, visited)) as unknown as T;
	}

	// Handle plain objects only
	if (obj.constructor === Object) {
		// Security: Filter out dangerous keys
		const safeObj = filterDangerousKeys(obj as Record<string, any>);
		const copy: Record<string, unknown> = {};
		Object.keys(safeObj).forEach((key) => {
			// Only process own properties
			if (Object.prototype.hasOwnProperty.call(safeObj, key)) {
				copy[key] = ObjectClone(safeObj[key], visited);
			}
		});
		return copy as T;
	}

	// Return primitives unchanged (except symbols)
	if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'bigint') {
		return obj;
	}

	throw new Error(`Unable to copy obj! Its type is not supported: ${typeof obj}`);
}

/**
 * Transforms an object using a transformer function.
 * Applies the transformer to the entire object structure.
 *
 * @template TInput - The input object type
 * @template TOutput - The output object type
 * @param obj - The object to transform
 * @param transformer - A function that takes the input object and returns the transformed object
 * @returns The transformed object
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * const transformed = TransformObject(obj, (input) => ({ sum: input.a + input.b + input.c }));
 * // Result: { sum: 6 }
 *
 * // Type-safe transformation
 * interface User { id: number; name: string; age: number; }
 * const user: User = { id: 1, name: 'John', age: 30 };
 * const summary = TransformObject(user, (u) => ({ displayName: `${u.name} (${u.age})`, identifier: u.id }));
 * // Result: { displayName: 'John (30)', identifier: 1 }
 * ```
 */
export function TransformObject<TInput extends object, TOutput extends object>(
	obj: TInput,
	transformer: TObjectTransformer<TInput, TOutput>,
): TOutput {
	if (!obj || typeof obj !== 'object') {
		throw new Error('TransformObject: Input must be a valid object');
	}

	return transformer(obj);
}
