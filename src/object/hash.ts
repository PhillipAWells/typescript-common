import { ObjectHasCircularReference } from './has-circular-reference.js';

// cyrb53-style hash mixing constants (chosen for good avalanche properties)
const HASH_SEED_1 = 0xdeadbeef;
const HASH_SEED_2 = 0x41c6ce57;
const HASH_MUL_1 = 2654435761;
const HASH_MUL_2 = 1597334677;
const HASH_MIX_1 = 2246822507;
const HASH_MIX_2 = 3266489909;
const HASH_SHIFT_HIGH = 16;
const HASH_SHIFT_LOW = 13;
const HASH_PAD_WIDTH = 8;
const HEXADECIMAL_RADIX = 16;

/**
 * A fast, non-cryptographic 64-bit hash using a cyrb53-style mixing strategy.
 * Browser-compatible and synchronous — no Node.js APIs required.
 * Returns a 16-character lowercase hex string.
 */
function defaultHash(data: string): string {
	let h1 = HASH_SEED_1;
	let h2 = HASH_SEED_2;
	for (let i = 0; i < data.length; i++) {
		const ch = data.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, HASH_MUL_1);
		h2 = Math.imul(h2 ^ ch, HASH_MUL_2);
	}
	h1 = (Math.imul(h1 ^ (h1 >>> HASH_SHIFT_HIGH), HASH_MIX_1) ^ Math.imul(h2 ^ (h2 >>> HASH_SHIFT_LOW), HASH_MIX_2)) >>> 0;
	h2 = (Math.imul(h2 ^ (h2 >>> HASH_SHIFT_HIGH), HASH_MIX_1) ^ Math.imul(h1 ^ (h1 >>> HASH_SHIFT_LOW), HASH_MIX_2)) >>> 0;
	return h1.toString(HEXADECIMAL_RADIX).padStart(HASH_PAD_WIDTH, '0') + h2.toString(HEXADECIMAL_RADIX).padStart(HASH_PAD_WIDTH, '0');
}

/**
 * Creates a hash of an object.
 *
 * By default a fast, non-cryptographic 64-bit hash is used that works in all
 * environments including browsers and React apps with no bundler polyfills
 * required. If you need a cryptographic hash, supply your own `hashFunction`.
 *
 * @param obj - The object to hash
 * @param hashFunction - Optional custom hash function (receives `JSON.stringify` output)
 * @returns A hash string of the object
 * @throws {Error} When the object contains circular references
 * @throws {Error} When the object cannot be serialized (e.g., undefined, functions, symbols)
 *
 * @example
 * ```typescript
 * // Default (fast, non-cryptographic, browser-compatible)
 * const hash = ObjectHash({ name: 'test', value: 42 });
 *
 * // Custom cryptographic hash (Node.js only)
 * import { createHash } from 'node:crypto';
 * const sha256Hash = ObjectHash({ name: 'test' }, (data) =>
 *   createHash('sha256').update(data).digest('base64')
 * );
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

	return hashFunction ? hashFunction(jsonString) : defaultHash(jsonString);
}
