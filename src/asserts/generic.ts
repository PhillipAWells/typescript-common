import { ObjectEquals } from './internal-utils.js';
import type { IAssertException, TGuard, TValidationPredicate } from './types.js';
import { SetExceptionClass, SetExceptionMessage, ThrowException } from './utils.js';

/** Maximum number of characters to include from a value in an error message. */
const MAX_VALUE_DISPLAY_LENGTH = 50;

/**
 * Type alias for constructor functions.
 * Represents any class constructor that can be instantiated.
 */
export type TConstructorFunction<T = any> = new (...args: any[]) => T;

/**
 * Error thrown when a nullish assertion fails — the value is not null or undefined
 * but was expected to be. Used by {@link AssertNull} when the provided value is a
 * live (non-null) reference.
 *
 * @example
 * throw new NullError('Expected value to be null or undefined');
 */
export class NullError extends Error {
	constructor(message?: string) {
		super(message ?? 'Value is not null or undefined.');
		this.name = 'NullError';
		Object.setPrototypeOf(this, NullError.prototype);
	}
}

/**
 * Error thrown when a non-null assertion fails — the value is null or undefined
 * but was expected to be non-nullish. Used by {@link AssertNotNull} when the
 * provided value is absent.
 *
 * @example
 * throw new NotNullError('Expected a non-null value but received null');
 */
export class NotNullError extends Error {
	constructor(message?: string) {
		super(message ?? 'Value is null or undefined.');
		this.name = 'NotNullError';
		Object.setPrototypeOf(this, NotNullError.prototype);
	}
}

/**
 * Error thrown when a custom predicate assertion fails.
 *
 * @example
 * throw new PredicateError('Predicate assertion failed');
 */
export class PredicateError extends Error {
	constructor(message?: string) {
		super(message ?? 'Value does not satisfy the predicate condition');
		this.name = 'PredicateError';
		Object.setPrototypeOf(this, PredicateError.prototype);
	}
}

/**
 * Error thrown when a value does not conform to a user-supplied type guard.
 *
 * @example
 * throw new TypeGuardError('Value does not conform to the required type');
 */
export class TypeGuardError extends Error {
	constructor(message?: string) {
		super(message ?? 'Type guard assertion failed');
		this.name = 'TypeGuardError';
		Object.setPrototypeOf(this, TypeGuardError.prototype);
	}
}

/**
 * Error thrown when a value is not an instance of the expected constructor.
 *
 * @example
 * throw new InstanceOfError('Value is not an instance of the expected type');
 */
export class InstanceOfError extends Error {
	constructor(message?: string) {
		super(message ?? 'InstanceOf assertion failed');
		this.name = 'InstanceOfError';
		Object.setPrototypeOf(this, InstanceOfError.prototype);
	}
}

/**
 * Error thrown when a value is not a function.
 *
 * @example
 * throw new FunctionError('Value is not a function');
 */
export class FunctionError extends Error {
	constructor(message?: string) {
		super(message ?? 'Function assertion failed');
		this.name = 'FunctionError';
		Object.setPrototypeOf(this, FunctionError.prototype);
	}
}

/**
 * Error thrown when a value is not a symbol.
 *
 * @example
 * throw new SymbolError('Value is not a symbol');
 */
export class SymbolError extends Error {
	constructor(message?: string) {
		super(message ?? 'Symbol assertion failed');
		this.name = 'SymbolError';
		Object.setPrototypeOf(this, SymbolError.prototype);
	}
}

/**
 * Error thrown when a class does not extend the expected base class.
 *
 * @example
 * throw new ExtendsError('Class does not extend the expected base class');
 */
export class ExtendsError extends Error {
	constructor(message?: string) {
		super(message ?? 'Extends assertion failed');
		this.name = 'ExtendsError';
		Object.setPrototypeOf(this, ExtendsError.prototype);
	}
}

/**
 * Asserts that a value equals an expected value using deep equality comparison.
 *
 * This function performs a comprehensive deep equality check between the provided value and
 * the expected value using ObjectUtils.Equals. The comparison algorithm handles:
 * - Primitive values (numbers, strings, booleans, null, undefined)
 * - Complex nested objects with multiple levels of nesting
 * - Arrays with elements in the same order
 * - Mixed data structures combining objects and arrays
 * - Special values like NaN, Infinity, and -0
 *
 * The deep comparison ensures that all nested properties and array elements are
 * recursively compared, making it suitable for complex data structure validation
 * in testing scenarios and runtime assertions.
 *
 * @template T - The type of values being compared (both value and expected must be of same type)
 * @param value - The actual value to compare against the expected value
 * @param expected - The expected value that the actual value should equal
 * @param exception - Configuration object for custom error handling and messaging.
 *                   Allows customization of error type, message, and additional metadata
 * @throws {PropertyError} When values are not deeply equal, with descriptive error message
 * @throws {TError} When custom exception type is specified and values don't match
 *
 * @example
 * ```typescript
 * // Primitive value comparisons
 * AssertEquals(5, 5);                               // ✓ Valid (numbers)
 * AssertEquals("hello", "hello");                   // ✓ Valid (strings)
 * AssertEquals(true, true);                         // ✓ Valid (booleans)
 *
 * // Array comparisons (order matters)
 * AssertEquals([1, 2, 3], [1, 2, 3]);              // ✓ Valid (same elements, same order)
 * AssertEquals([1, 2], [2, 1]);                     // ✗ Throws (different order)
 * AssertEquals([], []);                             // ✓ Valid (empty arrays)
 *
 * // Object comparisons (deep equality)
 * AssertEquals({a: 1, b: 2}, {a: 1, b: 2});        // ✓ Valid (same properties)
 * AssertEquals({a: {b: 1}}, {a: {b: 1}});          // ✓ Valid (nested objects)
 * AssertEquals({}, {});                             // ✓ Valid (empty objects)
 *
 * // Complex nested structures
 * const obj1 = {users: [{id: 1, name: "John"}], count: 1};
 * const obj2 = {users: [{id: 1, name: "John"}], count: 1};
 * AssertEquals(obj1, obj2);                         // ✓ Valid (deeply equal)
 *
 * // Failure cases
 * AssertEquals(5, 10);                              // ✗ Throws PropertyError
 * AssertEquals({a: 1}, {a: 2});                     // ✗ Throws PropertyError
 * AssertEquals([1, 2], [1, 2, 3]);                  // ✗ Throws PropertyError
 *
 * // Custom exception handling
 * AssertEquals(1, 2, {
 *   message: "Values should be equal"
 * });                                               // ✗ Throws with custom message
 * ```
 */
export function AssertEquals<T>(value: T, expected: T, exception: IAssertException = {}): void {
	if (!ObjectEquals(value, expected)) {
		SetExceptionMessage(exception, `Expected ${value} to equal ${expected}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value does not equal an expected value using deep equality comparison.
 *
 * This function performs a comprehensive deep equality check and ensures the values are NOT equal.
 * It uses the same sophisticated comparison logic as AssertEquals but with inverted logic,
 * making it perfect for validating that values have changed, are distinct from unwanted values,
 * or ensuring that mutations have occurred successfully.
 *
 * The deep comparison algorithm checks:
 * - All primitive values for strict inequality
 * - Nested object properties at all levels
 * - Array elements and their ordering
 * - Mixed data structures with complex nesting
 * - Special numeric values (NaN, Infinity, -0)
 *
 * This function is particularly useful in testing scenarios where you need to verify
 * that data transformations, mutations, or state changes have actually occurred.
 *
 * @template T - The type of values being compared (both value and expected must be of same type)
 * @param value - The actual value to compare against the unwanted value
 * @param expected - The value that should NOT be equal to the actual value
 * @param exception - Configuration object for custom error handling and messaging.
 *                   Defaults to empty object if not provided, allowing for optional customization
 * @throws {PropertyError} When values are deeply equal (and shouldn't be), with descriptive error message
 * @throws {TError} When custom exception type is specified and values are unexpectedly equal
 *
 * @example
 * ```typescript
 * // Primitive value comparisons (should be different)
 * AssertNotEquals(5, 10);                           // ✓ Valid (different numbers)
 * AssertNotEquals("hello", "world");                // ✓ Valid (different strings)
 * AssertNotEquals(true, false);                     // ✓ Valid (different booleans)
 *
 * // Array comparisons (should be different)
 * AssertNotEquals([1, 2], [1, 3]);                  // ✓ Valid (different elements)
 * AssertNotEquals([1, 2], [2, 1]);                  // ✓ Valid (different order)
 * AssertNotEquals([1], [1, 2]);                     // ✓ Valid (different lengths)
 *
 * // Object comparisons (should be different)
 * AssertNotEquals({a: 1}, {a: 2});                  // ✓ Valid (different property values)
 * AssertNotEquals({a: 1}, {b: 1});                  // ✓ Valid (different property names)
 * AssertNotEquals({a: {b: 1}}, {a: {b: 2}});        // ✓ Valid (different nested values)
 *
 * // Testing mutations and transformations
 * const original = {users: [{id: 1, name: "John"}]};
 * const modified = {users: [{id: 1, name: "Jane"}]};
 * AssertNotEquals(original, modified);              // ✓ Valid (data was modified)
 *
 * // Verifying state changes
 * let counter = 0;
 * const initialState = counter;
 * counter++;
 * AssertNotEquals(counter, initialState);           // ✓ Valid (state changed)
 *
 * // Failure cases (when values are unexpectedly equal)
 * AssertNotEquals(5, 5);                            // ✗ Throws PropertyError
 * AssertNotEquals([1, 2], [1, 2]);                  // ✗ Throws PropertyError
 * AssertNotEquals({a: 1}, {a: 1});                  // ✗ Throws PropertyError
 *
 * // Custom exception handling
 * AssertNotEquals(1, 1, {
 *   message: "Values should be different"
 * });                                               // ✗ Throws with custom message
 * ```
 */
export function AssertNotEquals<T>(value: T, expected: T, exception: IAssertException = {}): void {
	if (ObjectEquals(value, expected)) {
		SetExceptionMessage(exception, `Expected ${value} to not equal ${expected}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is null or undefined (nullish assertion).
 *
 * This method validates that the provided value is either null or undefined,
 * effectively performing a nullish assertion. This is useful for validating
 * that optional values are properly unset, that cleanup operations succeeded,
 * or that certain conditions result in null/undefined states.
 *
 * @template T - The type of the value being validated
 * @param value - The value to validate as null or undefined
 * @param exception - Optional exception configuration for custom error handling
 * @throws {NullError} When value is not null or undefined
 *
 * @example
 * ```typescript
 * AssertNull(null);                 // ✓ Valid
 * AssertNull(undefined);            // ✓ Valid
 * AssertNull("hello");              // ✗ Throws NullError
 * AssertNull(0);                    // ✗ Throws NullError
 * AssertNull(false);                // ✗ Throws NullError
 * AssertNull("");                   // ✗ Throws NullError
 *
 * // Validation of cleanup operations
 * function cleanup(resource: Resource | null) {
 *   resource?.dispose();
 *   resource = null;
 *   AssertNull(resource); // Verify cleanup succeeded
 * }
 * ```
 */
export function AssertNull<T>(value: T, exception: IAssertException = {}): void {
	SetExceptionClass(exception, NullError);
	if (value !== null && value !== undefined) {
		SetExceptionMessage(exception, `Expected null or undefined but received ${typeof value}: ${JSON.stringify(value)}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is not null or undefined (non-nullish assertion).
 *
 * This method validates that the provided value is neither null nor undefined,
 * effectively performing a non-nullish assertion. This is particularly useful
 * for validating function parameters, API responses, and optional values that
 * should have been initialized. After this assertion, TypeScript will narrow
 * the type to exclude null and undefined.
 *
 * @template T - The type of the value being validated
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate for non-null/undefined
 * @param exception - Optional exception configuration for custom error handling
 * @throws {NotNullError} When value is null or undefined
 *
 * @example
 * ```typescript
 * AssertNotNull("hello");           // ✓ Valid
 * AssertNotNull(0);                 // ✓ Valid (0 is not null/undefined)
 * AssertNotNull(false);             // ✓ Valid (false is not null/undefined)
 * AssertNotNull("");                // ✓ Valid (empty string is not null/undefined)
 * AssertNotNull(null);              // ✗ Throws NotNullError
 * AssertNotNull(undefined);         // ✗ Throws NotNullError
 *
 * // Type narrowing example
 * function process(value: string | null | undefined) {
 *   AssertNotNull(value);
 *   // value is now typed as string (null/undefined excluded)
 *   return value.toUpperCase();
 * }
 * ```
 */
export function AssertNotNull<T>(value: T, exception: IAssertException = {}): asserts value is T {
	SetExceptionClass(exception, NotNullError);
	if (value === null || value === undefined) {
		const actualValue = value === null ? 'null' : 'undefined';
		SetExceptionMessage(exception, `Expected non-null/non-undefined value but received ${actualValue}`);
		ThrowException(exception);
	}
}

/**
 * Generic assertion method that validates a value using a custom predicate function.
 *
 * This method provides a flexible way to perform custom validations using any
 * predicate function that returns a boolean. It's the most generic assertion
 * in the library and can be used to implement complex validation logic that
 * doesn't fit into other specific assertion methods.
 *
 * @template T - The type of value being validated
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate
 * @param predicate - A TValidationPredicate function that returns true if the value is valid
 * @param exception - Optional exception configuration for custom error handling
 * @throws {PredicateError} When predicate returns false
 *
 * @example
 * ```typescript
 * // Simple numeric validation
 * AssertPredicate(42, (x) => x > 0 && x < 100);   // ✓ Valid
 *
 * // String validation
 * AssertPredicate("hello", (s) => s.length > 3);   // ✓ Valid
 * AssertPredicate("hi", (s) => s.length > 3);      // ✗ Throws PredicateError
 *
 * // Complex object validation
 * AssertPredicate(user, (u) =>
 *   typeof u.name === 'string' &&
 *   u.age >= 0 &&
 *   u.email.includes('@')
 * );
 *
 * // Array validation
 * AssertPredicate([1, 2, 3], (arr) =>
 *   arr.every(n => typeof n === 'number')
 * );
 * ```
 */
export function AssertPredicate<T>(value: T, predicate: TValidationPredicate<T>, exception: IAssertException = {}): void {
	SetExceptionClass(exception, PredicateError);
	if (!predicate(value)) {
		SetExceptionMessage(exception, 'Value does not satisfy the predicate condition');
		ThrowException(exception);
	}
}

/**
 * Asserts that a value matches a specific type using a type guard function.
 *
 * This method validates that the provided value passes a custom type guard,
 * enabling complex type validations beyond primitive type checks. Type guards
 * are functions that return `value is T` and provide runtime type checking
 * with TypeScript type narrowing. This is particularly useful for validating
 * complex object structures and custom types.
 *
 * @template T - The target type to validate for
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate
 * @param typeGuard - A TGuard function that returns `value is T`
 * @param exception - Optional exception configuration for custom error handling
 * @throws {TypeGuardError} When value does not pass the type guard
 *
 * @example
 * ```typescript
 * // Define interfaces and type guards
 * interface User { name: string; age: number; }
 * const isUser = (obj: unknown): obj is User =>
 *   typeof obj === 'object' && obj !== null &&
 *   'name' in obj && typeof obj.name === 'string' &&
 *   'age' in obj && typeof obj.age === 'number';
 *
 * // Usage
 * AssertIsType(data, isUser);
 * // data is now typed as User
 *
 * // Array of specific type
 * const isStringArray = (arr: unknown): arr is string[] =>
 *   Array.isArray(arr) && arr.every(item => typeof item === 'string');
 *
 * AssertIsType(someArray, isStringArray);
 * // someArray is now typed as string[]
 * ```
 */
export function AssertIsType<T>(value: unknown, typeGuard: TGuard<T>, exception: IAssertException = {}): asserts value is T {
	SetExceptionClass(exception, TypeGuardError);
	if (!typeGuard(value)) {
		const actualType = value === null ? 'null' : value === undefined ? 'undefined' : typeof value;

		SetExceptionMessage(exception, `Expected value to conform to required type but received ${actualType}: ${JSON.stringify(value).slice(0, MAX_VALUE_DISPLAY_LENGTH)}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is an instance of a specific class or constructor function.
 *
 * This method validates that the provided value is an instance of the specified
 * constructor function using the instanceof operator. This is useful for validating
 * object instances, built-in types like Date and Error, and custom class instances.
 * After this assertion, the value is properly typed as an instance of the constructor.
 *
 * @template T - The instance type to validate for
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate as an instance
 * @param constructor - The constructor function to check against
 * @param exception - Optional exception configuration for custom error handling
 * @throws {InstanceOfError} When value is not an instance of the constructor
 *
 * @example
 * ```typescript
 * // Built-in types
 * AssertInstanceOf(new Date(), Date);                    // ✓ Valid
 * AssertInstanceOf(new Error(), Error);                  // ✓ Valid
 * AssertInstanceOf([], Array);                           // ✓ Valid
 * AssertInstanceOf(/regex/, RegExp);                     // ✓ Valid
 *
 * // Custom classes
 * class Person { constructor(public name: string) {} }
 * const person = new Person("John");
 * AssertInstanceOf(person, Person);                      // ✓ Valid
 *
 * // Invalid cases
 * AssertInstanceOf("string", Date);                      // ✗ Throws InstanceOfError
 * AssertInstanceOf(123, Error);                          // ✗ Throws InstanceOfError
 * AssertInstanceOf({}, Array);                           // ✗ Throws InstanceOfError
 * ```
 */
export function AssertInstanceOf<T>(value: unknown, constructor: TConstructorFunction<T>, exception: IAssertException = {}): asserts value is T {
	SetExceptionClass(exception, InstanceOfError);
	if (!(value instanceof constructor)) {
		const actualType = value === null ? 'null' : value === undefined ? 'undefined' : value.constructor?.name || typeof value;
		SetExceptionMessage(exception, `Expected instance of ${constructor.name} but received ${actualType}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is a function.
 *
 * This method validates that the provided value is a function (typeof === 'function').
 * Useful for runtime validation of callbacks, API hooks, and dynamic invocations.
 * Throws FunctionError or custom error if assertion fails.
 *
 * @param value - The value to validate as a function
 * @param exception - Optional exception configuration for custom error handling
 * @throws {FunctionError} When value is not a function
 *
 * @example
 * AssertFunction(() => {}); // ✓ Valid
 * AssertFunction(function() {}); // ✓ Valid
 * AssertFunction(123); // ✗ Throws FunctionError
 * AssertFunction(null); // ✗ Throws FunctionError
 */
export function AssertFunction(value: unknown, exception: IAssertException = {}): asserts value is (...args: any[]) => any {
	SetExceptionClass(exception, FunctionError);
	if (typeof value !== 'function') {
		const actualType = value === null ? 'null' : value === undefined ? 'undefined' : typeof value;
		SetExceptionMessage(exception, `Expected function but received ${actualType}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is a symbol.
 *
 * This method validates that the provided value is a symbol (typeof === 'symbol').
 * Useful for runtime validation of unique keys, metadata, and advanced API contracts.
 * Throws SymbolError or custom error if assertion fails.
 *
 * @param value - The value to validate as a symbol
 * @param exception - Optional exception configuration for custom error handling
 * @throws {SymbolError} When value is not a symbol
 *
 * @example
 * AssertSymbol(Symbol('foo')); // ✓ Valid
 * AssertSymbol(Symbol.iterator); // ✓ Valid
 * AssertSymbol('not-a-symbol'); // ✗ Throws SymbolError
 * AssertSymbol(123); // ✗ Throws SymbolError
 */
export function AssertSymbol(value: unknown, exception: IAssertException = {}): asserts value is symbol {
	SetExceptionClass(exception, SymbolError);
	if (typeof value !== 'symbol') {
		const actualType = value === null ? 'null' : value === undefined ? 'undefined' : typeof value;
		SetExceptionMessage(exception, `Expected symbol but received ${actualType}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a class extends another class.
 *
 * This method validates that the provided derived class extends the specified base class.
 * Useful for runtime validation of inheritance relationships in TypeScript and JavaScript.
 * Throws ExtendsError or custom error if assertion fails.
 *
 * @param derived - The class to validate as extending base
 * @param base - The base class to check against
 * @param exception - Optional exception configuration for custom error handling
 * @throws {ExtendsError} When derived does not extend base
 *
 * @example
 * class Base {}
 * class Derived extends Base {}
 * AssertExtends(Derived, Base); // ✓ Valid
 * AssertExtends(Base, Derived); // ✗ Throws ExtendsError
 */
export function AssertExtends(derived: abstract new (...args: any[]) => any,	base: abstract new (...args: any[]) => any,	exception: IAssertException = {}): void {
	SetExceptionClass(exception, ExtendsError);
	if (typeof derived !== 'function' || typeof base !== 'function') {
		SetExceptionMessage(exception, 'Both arguments must be class constructors');
		ThrowException(exception);
	}
	let proto = Object.getPrototypeOf(derived.prototype);
	const baseProto = base.prototype;
	let found = false;

	while (proto) {
		if (proto === baseProto) {
			found = true;
			break;
		}
		proto = Object.getPrototypeOf(proto);
	}
	if (!found) {
		SetExceptionMessage(exception, `Expected ${derived.name} to extend ${base.name}`);
		ThrowException(exception);
	}
}
