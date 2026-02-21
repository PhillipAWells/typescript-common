/**
 * Security utilities for object manipulation functions
 * Provides protection against prototype pollution, path traversal, and other security vulnerabilities
 *
 * @author Security Auditor Agent
 * @version 1.0.0
 */

/**
 * List of dangerous property names that should be blocked to prevent prototype pollution.
 * Only the three canonical prototype-pollution vectors are blocked; other Object.prototype
 * methods (toString, valueOf, hasOwnProperty, etc.) are legitimate property names.
 */
const DANGEROUS_PROPERTY_NAMES = new Set([
	'__proto__',
	'constructor',
	'prototype',
]);

/**
 * Regular expression patterns for detecting path traversal attempts
 */
const PATH_TRAVERSAL_PATTERNS = [
	/%2e%2e/i,                // URL encoded ..
	/%252e%252e/i,            // Double URL encoded ..
	new RegExp(String.fromCharCode(0)), // Null byte injection
	/%00/i,                   // URL encoded null byte
	/\uFEFF|\uFFFE|\uFFFF/,    // Unicode BOM and invalid characters
];

/**
 * Validates if a property key is safe to use (not dangerous for prototype pollution)
 *
 * @param key - The property key to validate
 * @returns True if the key is safe, false if it's dangerous
 */
export function isPropertyKeySafe(key: string): boolean {
	if (typeof key !== 'string') {
		return false;
	}

	// Check against dangerous property names
	if (DANGEROUS_PROPERTY_NAMES.has(key)) {
		return false;
	}

	// Check for properties starting with __ (dunder methods)
	if (key.startsWith('__')) {
		return false;
	}

	// Check for path traversal patterns
	for (const pattern of PATH_TRAVERSAL_PATTERNS) {
		if (pattern.test(key)) {
			return false;
		}
	}

	return true;
}

/**
 * Validates a property path for security issues
 *
 * @param path - The property path to validate (dot notation)
 * @returns True if the path is safe, false if it contains security risks
 */
export function isPropertyPathSafe(path: string): boolean {
	if (!path || typeof path !== 'string') {
		return false;
	}

	// Check if path starts or ends with a dot
	if (path.startsWith('.') || path.endsWith('.')) {
		return false;
	}

	// Check for consecutive dots (potential traversal)
	if (path.includes('..')) {
		return false;
	}

	// Validate each segment of the path
	const segments = path.split('.');
	return segments.every((segment) => isPropertyKeySafe(segment));
}

/**
 * Sanitizes a property key by removing or replacing dangerous characters
 *
 * @param key - The property key to sanitize
 * @returns Sanitized key or null if the key is too dangerous to sanitize
 */
export function sanitizePropertyKey(key: string): string | null {
	if (!isPropertyKeySafe(key)) {
		return null;
	}

	// Additional sanitization for edge cases
	return key.trim();
}

/**
 * Filters out dangerous keys from an object
 *
 * @param obj - The object to filter
 * @returns New object with only safe keys
 */
export function filterDangerousKeys<T extends Record<string, any>>(obj: T): Partial<T> {
	const filtered: Partial<T> = {};

	for (const key in obj) {
		if (Object.hasOwn(obj, key) && isPropertyKeySafe(key)) {
			filtered[key] = obj[key];
		}
	}

	return filtered;
}

/**
 * Interface for circular reference detector
 */
export interface ICircularReferenceDetector {
	markVisited(obj: object): void;
	isVisited(obj: object): boolean;
	clear(): void;
}

/**
 * Creates a circular reference detection utility using WeakSet
 *
 * @returns Object with methods to track and check for circular references
 */
export function createCircularReferenceDetector(): ICircularReferenceDetector {
	let visited = new WeakSet();

	return {
		/**
		 * Marks an object as visited
		 * @param obj - Object to mark as visited
		 */
		markVisited(obj: object): void {
			visited.add(obj);
		},

		/**
		 * Checks if an object has been visited (circular reference)
		 * @param obj - Object to check
		 * @returns True if object was already visited
		 */
		isVisited(obj: object): boolean {
			return visited.has(obj);
		},

		/**
		 * Clears the visited objects set
		 */
		clear(): void {
			// WeakSet doesn't have a clear method, so we create a new one
			visited = new WeakSet();
		},
	};
}

/** Default maximum input length for security validation */
const DEFAULT_MAX_INPUT_LENGTH = 10000;

/**
 * Validates input for common security issues.
 * Designed for property path validation, not general string validation.
 *
 * @param input - Input to validate
 * @param maxLength - Maximum allowed length
 * @returns True if input is safe
 */
export function isInputSafe(input: any, maxLength: number = DEFAULT_MAX_INPUT_LENGTH): boolean {
	// Check for null/undefined
	if (input === null || input === undefined) {
		return true;
	}

	// Check string length to prevent DoS
	if (typeof input === 'string' && input.length > maxLength) {
		return false;
	}

	// Check for dangerous string patterns
	if (typeof input === 'string') {
		for (const pattern of PATH_TRAVERSAL_PATTERNS) {
			if (pattern.test(input)) {
				return false;
			}
		}
	}

	return true;
}
