import type { IAssertException } from '../asserts/types.js';
import { SetExceptionClass, SetExceptionMessage, ThrowException } from '../asserts/utils.js';

/**
 * Error thrown when a value is not a valid boolean or fails a boolean assertion.
 *
 * @example
 * throw new BooleanError('Value is not a valid boolean');
 */
export class BooleanError extends Error {
	constructor(message?: string) {
		super(message ?? 'Invalid Boolean');
		this.name = 'BooleanError';
		Object.setPrototypeOf(this, BooleanError.prototype);
	}
}

/**
 * Asserts that a value is a boolean primitive type.
 *
 * This function performs a strict type assertion that validates the provided value
 * is of type 'boolean', ensuring it's either `true` or `false`. The assertion will
 * reject truthy/falsy values that are not actual boolean primitives, making it
 * ideal for type narrowing in TypeScript and runtime type validation.
 *
 * If the assertion fails, the function throws an exception and never returns.
 * If the assertion passes, TypeScript will narrow the type to `boolean` for
 * subsequent code execution.
 *
 * @param value - The value to validate and assert as a boolean primitive
 * @param exception - Optional exception configuration for custom error handling.
 *                   Can include custom error message, error type, or other metadata.
 * @throws {Error} When value is not a boolean primitive. The specific error type
 *                 depends on the exception configuration provided.
 *
 * @example
 * Basic usage with valid boolean values:
 * ```typescript
 * AssertBoolean(true);       // ✓ Passes - value is boolean true
 * AssertBoolean(false);      // ✓ Passes - value is boolean false
 * ```
 *
 * @example
 * Assertion failures with non-boolean values:
 * ```typescript
 * AssertBoolean(1);          // ✗ Throws - truthy number, not boolean
 * AssertBoolean(0);          // ✗ Throws - falsy number, not boolean
 * AssertBoolean("true");     // ✗ Throws - string, not boolean
 * AssertBoolean("false");    // ✗ Throws - string, not boolean
 * AssertBoolean(null);       // ✗ Throws - null, not boolean
 * AssertBoolean(undefined);  // ✗ Throws - undefined, not boolean
 * AssertBoolean([]);         // ✗ Throws - array, not boolean
 * AssertBoolean({});         // ✗ Throws - object, not boolean
 * ```
 *
 * @example
 * Using with custom exception handling:
 * ```typescript
 * import { AssertBoolean } from './boolean.js';
 *
 * // Custom error message
 * AssertBoolean(value, { message: 'Expected a boolean value' });
 *
 * // Type narrowing after successful assertion
 * function processValue(input: unknown) {
 *   AssertBoolean(input);
 *   // TypeScript now knows 'input' is boolean
 *   return input ? 'yes' : 'no';
 * }
 * ```
 */
export function AssertBoolean(value: unknown, exception: IAssertException = {}): asserts value is boolean {
	SetExceptionClass(exception, BooleanError);
	if (typeof value !== 'boolean') {
		SetExceptionMessage(exception, `Expected boolean but received ${typeof value}: ${String(value)}`);
		ThrowException(exception);
	}
}
