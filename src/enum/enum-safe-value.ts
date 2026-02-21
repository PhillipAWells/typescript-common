import { TEnumType, TEnumValue } from './types.js';
import { ValidateEnumValue } from './validate-enum-value.js';

/**
 * Gets an enum value safely with a fallback if the value is invalid
 * @param e The enum object
 * @param value The value to check against the enum
 * @param fallback The fallback value to return if the provided value is invalid
 * @returns The original value if valid in the enum, otherwise the fallback value
 * @example
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * EnumSafeValue(Direction, 'UP', 'DOWN'); // 'UP'
 * EnumSafeValue(Direction, 'INVALID', 'DOWN'); // 'DOWN'
 */
export function EnumSafeValue<T extends TEnumType = TEnumType>(e: T, value: TEnumValue, fallback: TEnumValue): TEnumValue {
	return ValidateEnumValue(e, value) ? value : fallback;
}
