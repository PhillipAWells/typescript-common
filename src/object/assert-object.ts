/**
 * Type guard that checks if the provided value is a non-null, non-array object.
 *
 * Use this for type narrowing in conditionals. For runtime assertions that
 * throw on failure, use {@link AssertObject} from the asserts module.
 *
 * @param item - The value to check
 * @returns True if the value is an object (not null and not an array)
 *
 * @example
 * ```typescript
 * if (IsObject(value)) {
 *   // value is now typed as Record<string, any>
 *   console.log(value.someProperty);
 * }
 * ```
 */
export function IsObject(item: unknown): item is Record<string, any> {
	return item !== null && typeof item === 'object' && !Array.isArray(item);
}
