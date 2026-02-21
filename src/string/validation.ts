import type { TStringValidator } from './types';

/**
 * Checks if a string is empty or contains only whitespace.
 *
 * @param value The string to check.
 * @returns `true` if the string is empty or contains only whitespace.
 * @see {@link TStringValidator}
 */
export const IS_BLANK_STRING: TStringValidator = (value: string): boolean => {
	return !value || (/^\s*$/u).test(value);
};

/**
 * Compiled regex pattern for hexadecimal validation.
 * Cached for optimal performance with repeated calls.
 */
const HEX_PATTERN = /^(?<prefix>#|0x)?(?<hex>[0-9a-f]+)$/iu;

/**
 * Checks if a string is a valid hexadecimal value.
 *
 * @param value The input string.
 * @returns `true` if the string is a valid hexadecimal value.
 * @see {@link TStringValidator}
 */
export const IS_HEX_STRING: TStringValidator = (value: string): boolean => {
	return HEX_PATTERN.test(value);
};
