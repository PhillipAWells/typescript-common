import { TConstructableObject } from './internal-utils.js';

/**
 * Type alias for constraint union patterns.
 * Represents common constraint combinations used across assertion modules.
 */
export type TConstraintValue = string | number | boolean | null | undefined;

/**
 * Type alias for comparison operators.
 * Represents the various comparison operations available in constraint validation.
 */
export type TComparisonOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';

/**
 * Type alias for validation result patterns.
 * Represents the union of possible validation outcomes.
 */
export type TValidationResult = true | Error;

/**
 * Configuration interface for assertion exception handling.
 *
 * This interface allows comprehensive customization of error behavior when assertions fail.
 * It provides flexibility to override both the error class and message used when throwing
 * assertion failures, enabling consistent error handling patterns across different assertion
 * types. This design supports both simple message overrides and complex error type hierarchies.
 *
 * The exception configuration follows an opt-in pattern where all properties are optional,
 * allowing users to customize only the aspects they need while falling back to sensible
 * defaults for unconfigured options.
 *
 * @interface IAssertException
 * @since 1.0.0
 *
 * @example
 * Basic usage with custom messages:
 * ```typescript
 * // Custom error class with custom message
 * const config: IAssertException = {
 *   class: ValidationError,
 *   message: "Custom validation failed"
 * };
 *
 * // Custom message only (uses default error class from assertion)
 * const config2: IAssertException = {
 *   message: "Value must be positive"
 * };
 *
 * // Custom error class only (uses default message from assertion)
 * const config3: IAssertException = {
 *   class: TypeError
 * };
 * ```
 *
 * @example
 * Advanced usage in assertion functions:
 * ```typescript
 * import { AssertString } from './string.js';
 *
 * // Using with built-in assertions
 * try {
 *   AssertString(123, {
 *     class: TypeError,
 *     message: "Username must be a string"
 *   });
 * } catch (error) {
 *   console.log(error instanceof TypeError); // true
 *   console.log(error.message); // "Username must be a string"
 * }
 *
 * // Reusable error configurations
 * const validationConfig: IAssertException = {
 *   class: ValidationError,
 *   message: "Input validation failed"
 * };
 *
 * AssertString(value, validationConfig);
 * AssertNumber(otherValue, validationConfig);
 * ```
 */
export interface IAssertException {
	/**
	 * Custom error class constructor to use when the assertion fails.
	 *
	 * This property allows specifying a custom error class that will be instantiated
	 * and thrown when the assertion fails. The class must be constructable with a
	 * message parameter. If not provided, the assertion function will use its default
	 * error class (e.g., StringError for string assertions, NumberError for number assertions).
	 *
	 * @default - Uses the default error class specific to each assertion function
	 *
	 * @example
	 * ```typescript
	 * // Using built-in error types
	 * const config1: IAssertException = { class: TypeError };
	 * const config2: IAssertException = { class: RangeError };
	 *
	 * // Using custom error classes
	 * class ValidationError extends Error {
	 *   constructor(message: string) {
	 *     super(message);
	 *     this.name = 'ValidationError';
	 *   }
	 * }
	 *
	 * const config3: IAssertException = { class: ValidationError };
	 * ```
	 */
	class?: TConstructableObject;

	/**
	 * Custom error message to use when the assertion fails.
	 *
	 * This property allows specifying a custom error message that will be used
	 * when creating the error instance. If not provided, the assertion function
	 * will generate a default descriptive message based on the specific validation
	 * that failed and the values involved.
	 *
	 * @default - Uses auto-generated descriptive message based on the failed assertion
	 *
	 * @example
	 * ```typescript
	 * // Custom messages for different contexts
	 * const userValidation: IAssertException = {
	 *   message: "User ID must be a positive integer"
	 * };
	 *
	 * const apiValidation: IAssertException = {
	 *   message: "API response format is invalid"
	 * };
	 *
	 * // Context-specific error messages
	 * const configValidation: IAssertException = {
	 *   class: ValidationError,
	 *   message: "Invalid configuration: expected string value"
	 * };
	 * ```
	 */
	message?: string;
}

/**
 * Type guard predicate function
 * @template T - The type being guarded
 * @param value - The value to check
 * @returns true if value is of type T, false otherwise
 */
export type TGuard<T> = (value: unknown) => value is T;

/**
 * Validation predicate function
 * @template T - The type of value being validated
 * @param value - The value to validate
 * @returns true if valid, false otherwise
 */
export type TValidationPredicate<T = unknown> = (value: T) => boolean;

/**
 * Array type guard predicate
 * @template T - The element type
 * @param value - The value to check
 * @returns true if value is an array of type T[], false otherwise
 */
export type TArrayTypeGuard<T> = (value: unknown) => value is T[];

/**
 * Object type guard predicate
 * @template T - The object type
 * @param value - The value to check
 * @returns true if value is of object type T, false otherwise
 */
export type TObjectTypeGuard<T extends object> = (value: unknown) => value is T;

/**
 * Nullable type guard predicate
 * @template T - The non-null type
 * @param value - The value to check
 * @returns true if value is not null or undefined, false otherwise
 */
export type TNonNullableGuard<T> = (value: T | null | undefined) => value is T;

/**
 * Custom assertion function type
 * @template T - The type being asserted
 * @param value - The value to assert
 * @param message - Optional error message
 * @throws IAssertException if assertion fails
 */
export type TAssertFunction<T = unknown> = (value: unknown, message?: string) => asserts value is T;
