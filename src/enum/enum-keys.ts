/**
 * Returns non-numeric keys from an enum object.
 *
 * @template O - The enum object type
 * @template K - The key type (defaults to `keyof O`)
 * @param obj - The enum object
 * @returns Array of enum keys (reverse-mapping numeric keys are excluded)
 *
 * @example
 * ```typescript
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * EnumKeys(Direction); // ['Up', 'Down']
 *
 * enum Status { Active = 0, Inactive = 1 }
 * EnumKeys(Status); // ['Active', 'Inactive']
 * ```
 */
export function EnumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	if (!obj) return [];

	return Object.keys(obj).filter((k) => Number.isNaN(Number(k))) as K[];
}
