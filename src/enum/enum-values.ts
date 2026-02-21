/**
 * Returns an array of all values in an enum
 * Filters out reverse mappings for numeric enums
 *
 * @template TEnum - The enum type
 * @param enumObj - The enum object
 * @returns Array of enum values
 *
 * @example
 * ```typescript
 * enum Color { Red = 0, Green = 1, Blue = 2 }
 * EnumValues(Color); // [0, 1, 2]
 *
 * enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }
 * EnumValues(Status); // ['ACTIVE', 'INACTIVE']
 * ```
 */
export function EnumValues<TEnum extends Record<string, string | number>>(
	enumObj: TEnum,
): Array<TEnum[keyof TEnum]> {
	if (!enumObj) return [];

	return Object.keys(enumObj)
		.filter(key => Number.isNaN(Number(key))) // Filter out reverse mappings
		.map(key => enumObj[key]) as Array<TEnum[keyof TEnum]>;
}
