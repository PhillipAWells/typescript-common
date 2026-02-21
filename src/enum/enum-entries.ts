import { TEnumType, TEnumValue } from './types.js';

/**
 * Returns non-numeric key-value pairs from an enum
 * @param e The enum object
 * @returns Array of [key, value] tuples for non-numeric keys only
 * @example
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * EnumEntries(Direction); // [['Up', 'UP'], ['Down', 'DOWN']]
 */
export function EnumEntries<T extends TEnumType = TEnumType>(e: T): [string, TEnumValue][] {
	if (!e) return [];

	return Object.entries(e).filter(([key]) => Number.isNaN(Number(key)));
}
