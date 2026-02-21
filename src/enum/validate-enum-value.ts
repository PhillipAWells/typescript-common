import { TEnumType, TEnumValue } from './types.js';
import { EnumValues } from './enum-values.js';

/**
 * Checks if a value is a valid value in the given enum
 * @param e The enum object
 * @param value The value to check
 * @returns True if the value is valid in the enum
 * @example
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * ValidateEnumValue(Direction, 'UP'); // true
 * ValidateEnumValue(Direction, 'INVALID'); // false
 */
export function ValidateEnumValue<T extends TEnumType = TEnumType>(e: T, value: TEnumValue): boolean {
	if (value === null || typeof value === 'undefined' || !e) return false;

	const possibleValues = EnumValues(e);
	return (possibleValues as TEnumValue[]).includes(value);
}
