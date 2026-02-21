import type { TCaseConverter } from './types';

/**
 * Converts a string to camelCase.
 *
 * @param value The input string.
 * @returns The camelCased string.
 * @see {@link TCaseConverter}
 */
export function CamelCase(value: string): string {
	if (value && typeof value === 'string') {
		return value
			.replace(/(?:^\w|[A-Z]|\b\w)/gu, (word, index) => {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/[-_\s]+(?<char>.)?/gu, (_, c) => {
				return c ? c.toUpperCase() : '';
			});
	}

	return '';
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param value The input string.
 * @returns The capitalized string.
 * @see {@link TCaseConverter}
 */
export const CAPITALIZE: TCaseConverter = (value: string): string => {
	if (value && typeof value === 'string') {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	return '';
};

/**
 * Converts a string to kebab-case.
 *
 * @param value The input string.
 * @returns The kebab-cased string.
 * @see {@link TCaseConverter}
 */
export const KEBAB_CASE: TCaseConverter = (value: string): string => {
	if (value && typeof value === 'string') {
		return value
			.replace(/(?<lower>[a-z])(?<upper>[A-Z])/gu, '$1-$2')
			.replace(/[\s_]+/gu, '-')
			.toLowerCase();
	}

	return '';
};

/**
 * Converts a string to PascalCase.
 *
 * @param value The input string.
 * @returns The PascalCased string.
 * @see {@link TCaseConverter}
 */
export const PASCAL_CASE: TCaseConverter = (value: string): string => {
	if (value && typeof value === 'string') {
		return value
			.replace(/(?:^\w|[A-Z]|\b\w)/gu, (word) => {
				return word.toUpperCase();
			})
			.replace(/[-_\s]+(?<char>.)?/gu, (_, c) => {
				return c ? c.toUpperCase() : '';
			});
	}

	return '';
};

/**
 * Converts a string to snake_case.
 *
 * @param value The input string.
 * @returns The snake_cased string.
 * @see {@link TCaseConverter}
 */
export const SNAKE_CASE: TCaseConverter = (value: string): string => {
	if (value && typeof value === 'string') {
		return value
			.replace(/(?<lower>[a-z])(?<upper>[A-Z])/gu, '$1_$2')
			.replace(/[\s-]+/gu, '_')
			.toLowerCase();
	}

	return '';
};

/**
 * Converts a string to SCREAMING_SNAKE_CASE.
 *
 * @param value The input string.
 * @returns The SCREAMING_SNAKE_CASED string.
 * @see {@link TCaseConverter}
 */
export const SCREAMING_SNAKE_CASE: TCaseConverter = (value: string): string => {
	return SNAKE_CASE(value).toUpperCase();
};
