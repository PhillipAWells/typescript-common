import { IAssertException } from '../asserts/types.js';
import { SetExceptionClass, SetExceptionMessage, ThrowException } from '../asserts/utils.js';

/** Maximum number of characters to include from a value in an error message. */
const MAX_VALUE_DISPLAY_LENGTH = 100;

/**
 * Error thrown when a value is not a valid object or fails an object assertion.
 *
 * @example
 * throw new ObjectError('Value is not a valid object');
 */
export class ObjectError extends Error {
	constructor(message?: string) {
		super(message ?? 'Object assertion failed');
		this.name = 'ObjectError';
		Object.setPrototypeOf(this, ObjectError.prototype);
	}
}

/**
 * Error thrown when an object is missing a required property or a property fails an assertion.
 *
 * @example
 * throw new PropertyError('Object is missing required property');
 */
export class ObjectPropertyError extends Error {
	constructor(message?: string) {
		super(message ?? 'Object Property Assertion Failed');
		this.name = 'ObjectPropertyError';
		Object.setPrototypeOf(this, ObjectPropertyError.prototype);
	}
}

/**
 * Asserts that a value is a plain object (not null, not an array, not a function).
 *
 * This method validates that the provided value is an object type, excluding null,
 * arrays, and functions which are technically objects in JavaScript but not plain
 * objects. After this assertion, the value is typed as Record<string, unknown>
 * for safe property access.
 *
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate as an object
 * @param exception - Optional exception configuration for custom error handling
 * @throws {ObjectError} When value is not a plain object
 *
 * @example
 * ```typescript
 * AssertObject({ name: "John" });       // ✓ Valid (plain object)
 * AssertObject({});                     // ✓ Valid (empty object)
 * AssertObject(new Date());             // ✓ Valid (object instance)
 * AssertObject([1, 2, 3]);              // ✗ Throws ObjectError (array)
 * AssertObject(null);                   // ✗ Throws ObjectError (null)
 * AssertObject("string");               // ✗ Throws ObjectError (primitive)
 * AssertObject(() => {});               // ✗ Throws ObjectError (function)
 * ```
 */
export function AssertObject(value: unknown, exception: IAssertException = {}): asserts value is Record<string, unknown> {
	SetExceptionClass(exception, ObjectError);
	if (typeof value !== 'object' || value === null || Array.isArray(value) || typeof value === 'function') {
		const actualType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
		let valueStr: string;

		try {
			if (typeof value === 'function') {
				valueStr = '[Function]';
			} else if (value === null) {
				valueStr = 'null';
			} else if (value === undefined) {
				valueStr = 'undefined';
			} else if (typeof value === 'symbol') {
				valueStr = `[Symbol: ${String(value)}]`;
			} else {
				valueStr = JSON.stringify(value);
			}
		} catch {
			valueStr = String(value);
		}
		 
		SetExceptionMessage(exception, `Expected object but received ${actualType}: ${valueStr.slice(0, MAX_VALUE_DISPLAY_LENGTH)}`);  
		ThrowException(exception);
	}
}

/**
 * Asserts that an object has a specific property (inherited or own).
 *
 * This method validates that the specified property exists in the object,
 * including properties from the prototype chain. Uses the 'in' operator
 * for property detection. This is useful for checking if an object conforms
 * to an expected interface or has required properties.
 *
 * @template T - The object type
 * @template K - The property key type
 * @template TError - Custom error type to throw on failure
 * @param value - The object to check for the property
 * @param property - The property key to check for
 * @param exception - Optional exception configuration for custom error handling
 * @throws {PropertyError} When object does not have the specified property
 *
 * @example
 * ```typescript
 * const obj = { name: "John", age: 30 };
 * AssertHasProperty(obj, "name");           // ✓ Valid (own property)
 * AssertHasProperty(obj, "toString");       // ✓ Valid (inherited property)
 * AssertHasProperty(obj, "invalid");        // ✗ Throws PropertyError
 *
 * // Type narrowing with property presence
 * function processUser(obj: unknown) {
 *   AssertObject(obj);
 *   AssertHasProperty(obj, "name");
 *   // obj["name"] is now accessible safely
 * }
 * ```
 */
export function AssertObjectHasProperty<T extends object, K extends PropertyKey>(value: T, property: K, exception: IAssertException = {}): void {
	// First check if value is an object, using ObjectError
	AssertObject(value, { class: ObjectError });

	// Then check for property existence, using the configured exception class or default
	SetExceptionClass(exception, ObjectPropertyError);
	if (!(property in value)) {
		SetExceptionMessage(exception, `Expected object to have property '${String(property)}' but property was not found`);
		ThrowException(exception);
	}
}

/**
 * Asserts that an object has a specific own property (not inherited).
 *
 * This method validates that the specified property exists as an own property
 * of the object, excluding properties from the prototype chain. Uses
 * Object.prototype.hasOwnProperty.call() for reliable detection. This is useful
 * when you need to ensure a property is directly defined on the object.
 *
 * @template T - The object type
 * @template K - The property key type
 * @template TError - Custom error type to throw on failure
 * @param value - The object to check for the own property
 * @param property - The property key to check for
 * @param exception - Optional exception configuration for custom error handling
 * @throws {PropertyError} When object does not have the specified own property
 *
 * @example
 * ```typescript
 * const obj = { name: "John" };
 * AssertHasOwnProperty(obj, "name");          // ✓ Valid (own property)
 * AssertHasOwnProperty(obj, "toString");      // ✗ Throws (inherited property)
 * AssertHasOwnProperty(obj, "invalid");       // ✗ Throws (doesn't exist)
 *
 * // Checking for data vs inherited methods
 * function validateUserData(obj: object) {
 *   AssertHasOwnProperty(obj, "id");          // Must be own property
 *   AssertHasOwnProperty(obj, "name");        // Must be own property
 * }
 * ```
 */
export function AssertObjectHasOwnProperty<T extends object, K extends PropertyKey>(value: T, property: K, exception: IAssertException = {}): void {
	// First check if value is an object, using ObjectError
	AssertObject(value, { class: ObjectError });

	// Then check for own property existence, using the configured exception class or default
	SetExceptionClass(exception, ObjectPropertyError);
	if (!Object.prototype.hasOwnProperty.call(value, property)) {
		SetExceptionMessage(exception, `Expected object to have own property '${String(property)}' but property was not found`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a specific property of an object is not null or undefined.
 *
 * This method validates that the specified property exists and has a non-nullish value.
 * It combines property existence checking with null/undefined validation. Useful for
 * validating that required object properties have been properly initialized.
 *
 * @template T - The object type
 * @template K - The property key type (must be a key of T)
 * @template TError - Custom error type to throw on failure
 * @param value - The object to check
 * @param property - The property key to validate for non-null value
 * @param exception - Optional exception configuration for custom error handling
 * @throws {PropertyError} When property is null, undefined, or doesn't exist
 *
 * @example
 * ```typescript
 * const user = { id: 123, name: "John", email: null };
 * AssertPropertyNotNull(user, "id");        // ✓ Valid (123 is not null/undefined)
 * AssertPropertyNotNull(user, "name");      // ✓ Valid ("John" is not null/undefined)
 * AssertPropertyNotNull(user, "email");     // ✗ Throws PropertyError (null)
 *
 * // Type narrowing for property values
 * function processUser(user: { name?: string | null }) {
 *   AssertPropertyNotNull(user, "name");
 *   // user.name is now typed as string (null/undefined excluded)
 * }
 * ```
 */
export function AssertObjectPropertyNotNull<T extends object, K extends keyof T>(value: T, property: K, exception: IAssertException = {}): void {
	// First check if value is an object, using ObjectError
	AssertObject(value, { class: ObjectError });

	// Then check for property value, using the configured exception class or default
	SetExceptionClass(exception, ObjectPropertyError);
	if (value[property] === null || value[property] === undefined) {
		const actualValue = value[property] === null ? 'null' : 'undefined';
		SetExceptionMessage(exception, `Expected property '${String(property)}' to be non-null/non-undefined but received ${actualValue}`);
		ThrowException(exception);
	}
}
