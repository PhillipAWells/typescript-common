import { isPropertyPathSafe, isPropertyKeySafe } from './security-utils.js';

/**
 * Safely gets a nested property from an object using a path string with dot notation.
 * Returns the default value if the path doesn't exist or any intermediate value is null/undefined.
 *
 * **Security Features:**
 * - Prevents access to dangerous internal properties
 * - Validates property paths to prevent path traversal attacks
 * - Blocks access to prototype chain properties
 *
 * @template T - The expected type of the property value
 * @param obj - Source object to navigate
 * @param path - Path to the property using dot notation (e.g., 'user.address.street')
 * @param defaultValue - Default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 *
 * @example
 * ```typescript
 * const user = {
 *   name: 'John',
 *   profile: {
 *     address: {
 *       street: '123 Main St',
 *       city: 'NYC',
 *       coordinates: { lat: 40.7128, lng: -74.0060 }
 *     },
 *     preferences: {
 *       theme: 'dark',
 *       notifications: true
 *     }
 *   }
 * };
 *
 * // Basic property access
 * ObjectGetPropertyByPath(user, 'name'); // 'John'
 * ObjectGetPropertyByPath(user, 'profile.address.street'); // '123 Main St'
 * ObjectGetPropertyByPath(user, 'profile.address.city'); // 'NYC'
 *
 * // Deep nested access
 * ObjectGetPropertyByPath(user, 'profile.address.coordinates.lat'); // 40.7128
 * ObjectGetPropertyByPath(user, 'profile.preferences.theme'); // 'dark'
 *
 * // Non-existent paths with defaults
 * ObjectGetPropertyByPath(user, 'profile.avatar', 'default.jpg'); // 'default.jpg'
 * ObjectGetPropertyByPath(user, 'settings.language', 'en'); // 'en'
 * ObjectGetPropertyByPath(user, 'profile.social.twitter'); // undefined
 *
 * // Type safety with generics
 * const lat = ObjectGetPropertyByPath<number>(user, 'profile.address.coordinates.lat', 0);
 * const theme = ObjectGetPropertyByPath<string>(user, 'profile.preferences.theme', 'light');
 *
 * // Handles null/undefined safely
 * ObjectGetPropertyByPath(null, 'any.path', 'default'); // 'default'
 * ObjectGetPropertyByPath(user, '', 'default'); // 'default'
 * ```
 */
export function ObjectGetPropertyByPath<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
	if (!obj || !path) {
		return defaultValue;
	}

	// Security validation: Check if the path is safe
	if (!isPropertyPathSafe(path)) {
		return defaultValue;
	}

	const keys = path.split('.');
	let result = obj;

	for (const key of keys) {
		// Security check for each key
		if (!isPropertyKeySafe(key)) {
			return defaultValue;
		}

		if (result === null || result === undefined || typeof result !== 'object') {
			return defaultValue;
		}

		// Use Object.hasOwnProperty to prevent prototype chain access
		if (!Object.prototype.hasOwnProperty.call(result, key)) {
			return defaultValue;
		}

		result = result[key];
	}

	return result === undefined ? defaultValue : result as T;
}

/**
 * Sets a nested property on an object using a path string with dot notation.
 * Automatically creates intermediate objects if they don't exist or are not objects.
 * Modifies the original object in place.
 *
 * **Security Features:**
 * - Prevents prototype pollution by blocking dangerous property names
 * - Validates property paths to prevent path traversal attacks
 * - Sanitizes input to prevent injection attacks
 *
 * @template T - The type of the value being set
 * @param obj - Target object to modify
 * @param path - Path to the property using dot notation (e.g., 'user.address.street')
 * @param value - Value to set at the specified path
 *
 * @example
 * ```typescript
 * const user = { name: 'John' };
 *
 * // Set simple nested properties
 * ObjectSetPropertyByPath(user, 'profile.age', 30);
 * ObjectSetPropertyByPath(user, 'profile.email', 'john@example.com');
 * console.log(user);
 * // {
 * //   name: 'John',
 * //   profile: { age: 30, email: 'john@example.com' }
 * // }
 *
 * // Set deeply nested properties
 * ObjectSetPropertyByPath(user, 'profile.address.street', '123 Main St');
 * ObjectSetPropertyByPath(user, 'profile.address.city', 'NYC');
 * ObjectSetPropertyByPath(user, 'profile.preferences.theme', 'dark');
 * console.log(user);
 * // {
 * //   name: 'John',
 * //   profile: {
 * //     age: 30,
 * //     email: 'john@example.com',
 * //     address: { street: '123 Main St', city: 'NYC' },
 * //     preferences: { theme: 'dark' }
 * //   }
 * // }
 *
 * // Overwrite existing values
 * ObjectSetPropertyByPath(user, 'profile.age', 31);
 * ObjectSetPropertyByPath(user, 'profile.address.street', '456 Oak Ave');
 *
 * // Handle different value types
 * ObjectSetPropertyByPath(user, 'profile.active', true);
 * ObjectSetPropertyByPath(user, 'profile.tags', ['developer', 'javascript']);
 * ObjectSetPropertyByPath(user, 'profile.metadata.created', new Date());
 *
 * // Safe handling of edge cases
 * ObjectSetPropertyByPath(null, 'any.path', 'value'); // No effect, safely ignored
 * ObjectSetPropertyByPath(user, '', 'value'); // No effect, safely ignored
 * ```
 */
export function ObjectSetPropertyByPath<T = any>(obj: any, path: string, value: T): void {
	if (!obj || !path) {
		return;
	}

	// Security validation: Check if the path is safe
	if (!isPropertyPathSafe(path)) {
		return;
	}

	const keys = path.split('.');
	const lastKey = keys.pop();
	if (lastKey === undefined) {
		return;
	}

	// Additional security check for the final key
	if (!isPropertyKeySafe(lastKey)) {
		return;
	}

	let current = obj;

	for (const key of keys) {
		// Security check for each intermediate key
		if (!isPropertyKeySafe(key)) {
			return;
		}

		if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key];
	}

	current[lastKey] = value;
}
