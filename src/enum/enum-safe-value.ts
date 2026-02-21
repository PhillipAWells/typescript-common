import { TEnumType, TEnumValue } from './types.js';
import { ValidateEnumValue } from './validate-enum-value.js';

/**
 * Gets an enum value safely, returning a fallback if the value is not a valid enum member.
 *
 * @template T - The enum type
 * @param e - The enum object
 * @param value - The value to check against the enum
 * @param fallback - The fallback value to return if `value` is not a valid enum member
 * @returns `value` if it is valid in the enum, otherwise `fallback`
 *
 * @example
 * ```typescript
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * EnumSafeValue(Direction, 'UP', 'DOWN');      // 'UP'
 * EnumSafeValue(Direction, 'INVALID', 'DOWN'); // 'DOWN'
 * ```
 */
export function EnumSafeValue<T extends TEnumType = TEnumType>(e: T, value: TEnumValue, fallback: TEnumValue): TEnumValue {
	return ValidateEnumValue(e, value) ? value : fallback;
}
