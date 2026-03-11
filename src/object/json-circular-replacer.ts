/**
 * Creates a JSON.stringify replacer function that handles circular references
 * by replacing them with a placeholder string.
 *
 * Unlike `ObjectHasCircularReference` which is designed for manual recursive
 * traversal with explicit entry/exit control, this utility works inside
 * `JSON.stringify`'s replacer context where only entry is signaled. It infers
 * backtracking from the `this` context (the parent object).
 *
 * @param placeholder - The string to use for circular references (default: '[Circular]')
 * @returns A replacer function for use with JSON.stringify
 *
 * @example
 * ```typescript
 * const circular: any = { a: 1 };
 * circular.self = circular;
 *
 * // Without replacer - throws TypeError
 * JSON.stringify(circular); // Error: Converting circular structure to JSON
 *
 * // With replacer - safely serializes
 * JSON.stringify(circular, CreateJsonCircularReplacer());
 * // '{"a":1,"self":"[Circular]"}'
 *
 * // Custom placeholder
 * JSON.stringify(circular, CreateJsonCircularReplacer('[Ref]'));
 * // '{"a":1,"self":"[Ref]"}'
 * ```
 *
 * @example
 * ```typescript
 * // Utility wrapper for safe JSON serialization
 * function safeStringify(obj: unknown): string {
 *   return JSON.stringify(obj, CreateJsonCircularReplacer());
 * }
 * ```
 */
export function CreateJsonCircularReplacer(
	placeholder: string = '[Circular]',
): (this: unknown, key: string, value: unknown) => unknown {
	const ancestors: object[] = [];

	return function(this: unknown, _key: string, value: unknown): unknown {
		// Primitives and null are safe
		if (typeof value !== 'object' || value === null) {
			return value;
		}

		// Find where the parent (this) is in the ancestor stack.
		// If the parent isn't found (-1), parentIndex + 1 = 0, so we clear the
		// entire stack (we're at the root). Otherwise, we trim to the parent's
		// level, removing any siblings that were previously visited.
		const parentIndex = ancestors.lastIndexOf(this as object);
		ancestors.splice(parentIndex + 1);

		// Check if we've seen this value as an ancestor (circular reference)
		if (ancestors.includes(value as object)) {
			return placeholder;
		}

		// Add current value to ancestor stack
		ancestors.push(value as object);

		return value;
	};
}
