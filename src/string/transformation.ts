import type { TStringTransformer } from './types';

/**
 * Reverses a string.
 *
 * @param input The input string.
 * @returns The reversed string.
 * @see {@link TStringTransformer}
 */
export const REVERSE_STRING: TStringTransformer = (input: string): string => {
	if (input && typeof input === 'string') {
		return Array.from(input).reverse().join('');
	}

	return '';
};

/**
 * Converts a string to a URL-friendly slug.
 *
 * @param input The input string.
 * @returns The URL-friendly slug.
 * @see {@link TStringTransformer}
 */
export const SLUGIFY: TStringTransformer = (input: string): string => {
	if (input && typeof input === 'string') {
		return input
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/gu, '')
			.replace(/[\s_-]+/gu, '-')
			.replace(/^-+|-+$/gu, '');
	}

	return '';
};
