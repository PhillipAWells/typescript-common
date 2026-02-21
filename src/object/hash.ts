import { createHash } from 'node:crypto';
import { ObjectHasCircularReference } from './has-circular-reference.js';

/**
 * Creates a hash of an object using SHA-256.
 *
 * @param obj - The object to hash
 * @param hashFunction - Optional custom hash function (default: SHA-256)
 * @returns A hash string of the object
 * @throws {Error} When the object contains circular references
 * @throws {Error} When the object cannot be serialized (e.g., undefined, functions, symbols)
 *
 * @example
 * ```typescript
 * // Default SHA-256 hash
 * const hash = ObjectHash({ name: 'test', value: 42 });
 *
 * // Using custom hash function
 * const customHash = ObjectHash({ name: 'test', value: 42 }, (data) => customHashFunction(data));
 * ```
 */
export function ObjectHash(obj: any, hashFunction?: (data: string) => string): string {
	// Check for circular references before attempting to stringify
	if (ObjectHasCircularReference(obj)) {
		throw new Error('Cannot hash object with circular references');
	}

	const jsonString = JSON.stringify(obj);

	// Handle cases where JSON.stringify returns undefined
	if (jsonString === undefined) {
		throw new Error('Cannot hash object: JSON.stringify returned undefined');
	}

	// Use provided hash function or default to SHA-256
	if (hashFunction) {
		return hashFunction(jsonString);
	}

	// Default to SHA-256 base64
	const hash = createHash('sha256').update(jsonString).digest('base64');
	return hash;
}
