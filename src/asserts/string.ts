import type { IAssertException } from './types.js';
import { SetExceptionClass, SetExceptionMessage, ThrowException } from './utils.js';

/**
 * Cache for compiled regex patterns to improve performance when the same patterns are used repeatedly.
 * Maps regex source + flags to the compiled RegExp object for efficient reuse.
 *
 * @internal
 */
const REGEX_PATTERN_CACHE = new Map<string, RegExp>();

/**
 * Maximum number of cached regex patterns to prevent unbounded memory growth.
 * When this limit is reached, the cache will be cleared to maintain memory efficiency.
 *
 * @internal
 */
const MAX_CACHE_SIZE = 100;

/**
 * Number of oldest cache entries to evict in one batch when the cache is full.
 *
 * @internal
 */
const CACHE_EVICTION_BATCH_SIZE = 20;

/**
 * Gets a cached regex pattern or creates and caches a new one.
 * This optimization improves performance when the same regex patterns are used repeatedly.
 *
 * @param source - The regex pattern source string
 * @param flags - The regex flags string
 * @returns The compiled RegExp object
 * @internal
 */
function getCachedRegex(source: string, flags: string = ''): RegExp {
	const cacheKey = `${source}:::${flags}`;
	let regex = REGEX_PATTERN_CACHE.get(cacheKey);

	if (!regex) {
		// Use LRU eviction: delete oldest entries when cache reaches limit
		if (REGEX_PATTERN_CACHE.size >= MAX_CACHE_SIZE) {
			const keysToDelete = Array.from(REGEX_PATTERN_CACHE.keys()).slice(0, CACHE_EVICTION_BATCH_SIZE);
			keysToDelete.forEach(key => REGEX_PATTERN_CACHE.delete(key));
		}

		regex = new RegExp(source, flags);
		REGEX_PATTERN_CACHE.set(cacheKey, regex);
	}

	return regex;
}

/**
 * Error thrown when a value is not a valid string or fails a string assertion.
 *
 * @example
 * throw new StringError('Value is not a valid string');
 */
export class StringError extends Error {
	constructor(message?: string) {
		super(message ?? 'String Assertion Failed');
		this.name = 'StringError';
		Object.setPrototypeOf(this, StringError.prototype);
	}
}

/**
 * Asserts that a value is a string primitive type.
 *
 * This method validates that the provided value is of type 'string'. It accepts
 * any string including empty strings. This is a strict type check that will
 * reject string objects created with new String().
 *
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate as a string
 * @param exception - Optional exception configuration for custom error handling
 * @throws {StringError} When value is not a string primitive
 *
 * @example
 * ```typescript
 * AssertString("hello");             // ✓ Valid
 * AssertString("");                  // ✓ Valid (empty string is still a string)
 * AssertString("123");               // ✓ Valid (numeric string)
 * AssertString(123);                 // ✗ Throws StringError (number)
 * AssertString(null);                // ✗ Throws StringError
 * AssertString(new String("hello")); // ✗ Throws StringError (String object)
 * ```
 */
export function AssertString(value: unknown, exception: IAssertException = {}): asserts value is string {
	SetExceptionClass(exception, StringError);
	if (typeof value !== 'string') {
		SetExceptionMessage(exception, `Expected string but received ${typeof value}: ${String(value)}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is a non-empty string (after trimming whitespace).
 *
 * This method validates that the provided value is a string and contains at least
 * one non-whitespace character after trimming. This is useful for validating user
 * inputs, form fields, and API parameters where empty or whitespace-only strings
 * are not acceptable.
 *
 * @template TError - Custom error type to throw on failure
 * @param value - The value to validate as a non-empty string
 * @param exception - Optional exception configuration for custom error handling
 * @throws {StringError} When value is not a string or is empty/whitespace-only
 *
 * @example
 * ```typescript
 * AssertStringNotEmpty("hello");         // ✓ Valid
 * AssertStringNotEmpty("  a  ");         // ✓ Valid (has non-whitespace content)
 * AssertStringNotEmpty("x");             // ✓ Valid (single character)
 * AssertStringNotEmpty("");              // ✗ Throws StringError (empty)
 * AssertStringNotEmpty("   ");           // ✗ Throws StringError (whitespace only)
 * AssertStringNotEmpty("\t\n  ");        // ✗ Throws StringError (whitespace only)
 * AssertStringNotEmpty(123);             // ✗ Throws StringError (not a string)
 * ```
 */
export function AssertStringNotEmpty(value: unknown, exception: IAssertException = {}): asserts value is string {
	SetExceptionClass(exception, StringError);
	if (typeof value !== 'string') {
		SetExceptionMessage(exception, `Expected non-empty string but received ${typeof value}: ${String(value)}`);
		ThrowException(exception);
	}
	const str = value as string;
	if (str === '') {
		SetExceptionMessage(exception, 'Expected non-empty string but received empty string');
		ThrowException(exception);
	}
	if (str.trim() === '') {
		SetExceptionMessage(exception, 'Expected non-empty string but received whitespace-only string');
		ThrowException(exception);
	}
}

/**
 * Asserts that a string matches a regular expression pattern.
 *
 * This method validates that the provided string matches the specified regular
 * expression pattern. The string must be a valid string type (use AssertString first
 * if needed). Useful for validating formats like emails, phone numbers, IDs, and
 * other structured text data.
 *
 * For performance optimization, regex patterns are cached when possible to avoid
 * recompilation of the same patterns. This provides significant performance benefits
 * when validating many values against the same pattern.
 *
 * @template TError - Custom error type to throw on failure
 * @param value - The string to test against the pattern
 * @param regex - The regular expression pattern to match against
 * @param exception - Optional exception configuration for custom error handling
 * @throws {StringError} When string does not match the pattern
 *
 * @example
 * ```typescript
 * // Email validation
 * AssertStringMatches("hello@example.com", /^[^\s@]+@[^\s@]+\.[^\s@]+$/);  // ✓ Valid
 *
 * // Digits only validation
 * AssertStringMatches("123", /^\d+$/);                                     // ✓ Valid
 * AssertStringMatches("12a", /^\d+$/);                                     // ✗ Throws StringError
 *
 * // Phone number format
 * AssertStringMatches("(555) 123-4567", /^\(\d{3}\) \d{3}-\d{4}$/);       // ✓ Valid
 *
 * // Alphanumeric with length constraint
 * AssertStringMatches("abc123", /^[a-zA-Z0-9]{3,10}$/);                   // ✓ Valid
 * AssertStringMatches("ab", /^[a-zA-Z0-9]{3,10}$/);                       // ✗ Throws (too short)
 *
 * // Performance benefit with repeated pattern usage
 * const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 * AssertStringMatches("user1@example.com", emailPattern); // Cached for future use
 * AssertStringMatches("user2@example.com", emailPattern); // Uses cached pattern
 * ```
 */
export function AssertStringMatches(value: string, regex: RegExp, exception: IAssertException = {}): void {
	SetExceptionClass(exception, StringError);
	AssertString(value, exception); // Ensure value is a string before matching

	// Use cached regex for better performance when possible
	// If the regex has a source and flags, we can cache it for reuse
	let testRegex: RegExp;
	if (regex.source && regex.flags !== undefined) {
		testRegex = getCachedRegex(regex.source, regex.flags);
	} else {
		// Fallback to original regex if caching is not possible
		testRegex = regex;
	}

	if (!testRegex.test(value)) {
		SetExceptionMessage(exception, `String does not match the required pattern: ${regex.toString()}`);
		ThrowException(exception);
	}
}
