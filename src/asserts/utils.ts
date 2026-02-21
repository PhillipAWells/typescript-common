import { TConstructableObject } from './internal-utils.js';
import { IAssertException } from './types.js';

/**
 * Throws an exception using the configured error class and message.
 *
 * This function is the central point for throwing assertion errors throughout the library.
 * It respects the exception configuration provided, using either a custom error class
 * or falling back to the standard Error class. The function ensures that all assertion
 * failures are thrown consistently with appropriate error types and messages.
 *
 * @param exception - Exception configuration containing error class and/or message
 * @throws {Error} The configured error class with the specified message, or generic Error if no class specified
 *
 * @example
 * ```typescript
 * // Throw with custom error class
 * ThrowException({
 *   class: TypeError,
 *   message: "Expected string but got number"
 * });
 *
 * // Throw with default Error class
 * ThrowException({
 *   message: "Validation failed"
 * });
 *
 * // Throw with minimal configuration
 * ThrowException({}); // Throws generic "An assertion error occurred"
 * ```
 */
export function ThrowException(exception: IAssertException): void {
	if (!exception.class) {
		throw new Error(exception.message ?? 'An assertion error occurred');
	}
	throw new exception.class(exception.message ?? 'An assertion error occurred');
}

/**
 * Sets the error class for an exception configuration if not already specified.
 *
 * This utility function is used to configure the default error class that should be
 * thrown when an assertion fails. It respects existing configuration unless forced,
 * allowing assertion functions to set sensible defaults while still permitting
 * user customization.
 *
 * @param exception - Exception configuration object to modify
 * @param errorClass - The error class constructor to set as default
 * @param force - Whether to override existing error class configuration (default: false)
 *
 * @example
 * ```typescript
 * const config: IAssertException = {};
 *
 * // Set default error class (won't override if already set)
 * SetExceptionClass(config, TypeError);
 * console.log(config.class === TypeError); // true
 *
 * // Won't override existing class unless forced
 * SetExceptionClass(config, RangeError);
 * console.log(config.class === TypeError); // still true
 *
 * // Force override existing class
 * SetExceptionClass(config, RangeError, true);
 * console.log(config.class === RangeError); // true
 * ```
 */
export function SetExceptionClass(exception: IAssertException, errorClass: TConstructableObject, force: boolean = false): void {
	if (!force && exception.class !== undefined) return;
	exception.class = errorClass;
}

/**
 * Sets the error message for an exception configuration if not already specified.
 *
 * This utility function is used to configure the default error message that should be
 * used when an assertion fails. It respects existing configuration unless forced,
 * allowing assertion functions to set descriptive defaults while still permitting
 * user customization of error messages.
 *
 * @param exception - Exception configuration object to modify
 * @param message - The error message to set as default
 * @param force - Whether to override existing error message configuration (default: false)
 *
 * @example
 * ```typescript
 * const config: IAssertException = {};
 *
 * // Set default error message (won't override if already set)
 * SetExceptionMessage(config, "Value must be positive");
 * console.log(config.message); // "Value must be positive"
 *
 * // Won't override existing message unless forced
 * SetExceptionMessage(config, "Different message");
 * console.log(config.message); // still "Value must be positive"
 *
 * // Force override existing message
 * SetExceptionMessage(config, "Forced message", true);
 * console.log(config.message); // "Forced message"
 * ```
 */
export function SetExceptionMessage(exception: IAssertException, message: string, force: boolean = false): void {
	if (!force && exception.message !== undefined) return;
	exception.message = message;
}
