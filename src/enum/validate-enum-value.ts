import { TEnumType, TEnumValue } from './types.js';
import { EnumValues } from './enum-values.js';

/**
 * Checks if a value is a valid member of the given enum.
 *
 * @template T - The enum type
 * @param e - The enum object
 * @param value - The value to check
 * @returns `true` if the value is a valid enum member, `false` otherwise
 *
 * @example
 * ```typescript
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * ValidateEnumValue(Direction, 'UP');      // true
 * ValidateEnumValue(Direction, 'INVALID'); // false
 * ```
 */
export function ValidateEnumValue<T extends TEnumType = TEnumType>(e: T, value: TEnumValue): boolean {
	if (value === null || typeof value === 'undefined' || !e) return false;

	const possibleValues = EnumValues(e);
	return (possibleValues as TEnumValue[]).includes(value);
}
