/**
 * Represents a value in an enum, either a string or number.
 */
export type TEnumValue = string | number;

/**
 * Represents an enum as a record mapping string keys to enum values.
 */
export type TEnumType = Record<string, TEnumValue>;
