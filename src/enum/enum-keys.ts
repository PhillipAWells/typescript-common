/**
 * Returns non-numeric keys from an enum object
 * @param obj The enum object
 * @returns Array of enum keys
 * @example
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * EnumKeys(Direction); // ['Up', 'Down']
 */
export function EnumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	if (!obj) return [];

	return Object.keys(obj).filter((k) => Number.isNaN(Number(k))) as K[];
}
