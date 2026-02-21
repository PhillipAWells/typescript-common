/**
 * String validator function type
 * @param value - The string to validate
 * @returns true if valid, false otherwise
 */
export type TStringValidator = (value: string) => boolean;

/**
 * String formatter function type with optional parameters
 * @param value - The string to format
 * @param params - Optional formatting parameters
 * @returns The formatted string
 */
export type TStringFormatter = (value: string, ...params: unknown[]) => string;

/**
 * String transformer function type
 * @param input - The input string
 * @returns The transformed string
 */
export type TStringTransformer = (input: string) => string;

/**
 * Case converter function type
 * @param value - The string to convert
 * @returns The converted string
 */
export type TCaseConverter = (value: string) => string;

/**
 * String predicate function type
 * @param value - The string to test
 * @returns true if the string passes the predicate, false otherwise
 */
export type TStringPredicate = (value: string) => boolean;

/**
 * Format parameter value types
 */
export type TFormatValue = string | number | boolean | null | undefined;

/**
 * Format parameters as key-value pairs
 */
export type TFormatParams = Record<string, TFormatValue>;

/**
 * Format parameters as positional array
 */
export type TFormatArgs = TFormatValue[];
