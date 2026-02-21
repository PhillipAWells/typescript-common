import { TEnumType, TEnumValue } from './types.js';
import { EnumEntries } from './enum-entries.js';

/**
 * Gets the enum key for a given value
 * @param e The enum object
 * @param value The enum value to look up
 * @returns The key corresponding to the value or undefined if not found
 * @example
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * EnumKeyByValue(Direction, 'UP'); // 'Up'
 * EnumKeyByValue(Direction, 'INVALID'); // undefined
 */
export function EnumKeyByValue<T extends TEnumType = TEnumType>(e: T, value: TEnumValue): string | undefined {
	if (value === null || typeof value === 'undefined' || !e) return undefined;

	const entries = EnumEntries(e);
	const found = entries.find(([, val]) => val === value);
	if (found) return found[0];

	return undefined;
}
