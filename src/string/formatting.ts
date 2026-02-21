import type { TFormatParams, TFormatArgs } from './types';

/**
 * Escapes a string for safe use in HTML by replacing special characters with
 * their HTML entity equivalents.
 *
 * @param str - The input string
 * @returns The HTML-escaped string
 *
 * @example
 * ```typescript
 * EscapeHTML('<b>Hello & "World"</b>');
 * // '&lt;b&gt;Hello &amp; &quot;World&quot;&lt;/b&gt;'
 * ```
 */
export function EscapeHTML(str: string): string {
	if (str && typeof str === 'string') {
		return str
			.replace(/&/gu, '&amp;')
			.replace(/</gu, '&lt;')
			.replace(/>/gu, '&gt;')
			.replace(/"/gu, '&quot;')
			.replace(/'/gu, '&#039;');
	}

	return '';
}

/**
 * Formats a string by replacing placeholders with values
 * Supports both named placeholders {name} and positional {0}, {1}
 *
 * @param template - The template string with placeholders
 * @param params - Either an object with named parameters or array of positional parameters
 * @returns The formatted string
 *
 * @example
 * ```typescript
 * // Named parameters
 * FormatString('Hello {name}!', { name: 'World' }); // 'Hello World!'
 *
 * // Positional parameters
 * FormatString('Hello {0}!', ['World']); // 'Hello World!'
 *
 * // Mixed types
 * FormatString('Count: {count}, Active: {active}', {
 *   count: 42,
 *   active: true
 * }); // 'Count: 42, Active: true'
 * ```
 */
export function FormatString(
	template: string,
	params: TFormatParams | TFormatArgs,
): string {
	if (template && typeof template === 'string') {
		if (params && (Array.isArray(params) || typeof params === 'object')) {
			if (Array.isArray(params)) {
				return template.replace(/{(\d+)}/g, (match, index) => {
					const value = params[parseInt(index, 10)];
					return value !== undefined && value !== null ? String(value) : match;
				});
			}

			return template.replace(/{(\w+)}/g, (match, key) => {
				const value = params[key];
				return value !== undefined && value !== null ? String(value) : match;
			});
		}

		return template;
	}

	return '';
}

/**
 * Truncates a string to a specified length, appending an ellipsis if truncated.
 *
 * @param str The string to truncate.
 * @param maxLength The maximum length before truncation.
 * @param ellipsis The string to append when truncated (default: '...').
 * @returns The truncated string.
 */
export function TruncateString(str: string, maxLength: number, ellipsis = '...'): string {
	if (str && typeof str === 'string' && maxLength > 0) {
		if (str.length <= maxLength) {
			return str;
		}

		return str.slice(0, maxLength) + ellipsis;
	}

	return '';
}

/**
 * Pads a string to a specified length.
 *
 * @param str The input string.
 * @param length The target length.
 * @param char The character to pad with (default: ' ').
 * @param padEnd If true, pads the end; otherwise, pads the start (default: true).
 * @returns The padded string.
 */
export function PadString(str: string, length: number, char = ' ', padEnd = true): string {
	if (str && typeof str === 'string' && length > str.length) {
		const paddingLength = length - str.length;
		const padding = char.repeat(paddingLength);

		return padEnd ? str + padding : padding + str;
	}

	return str || '';
}

/**
 * Removes all HTML tags from a string.
 *
 * @param str The input string.
 * @returns The string with all HTML tags stripped.
 *
 * @example
 * ```typescript
 * StripHTML('<p>Hello <strong>World</strong></p>'); // 'Hello World'
 * ```
 */
export function StripHTML(str: string): string {
	if (!str || typeof str !== 'string') return '';
	return str.replace(/<[^>]*>/gu, '');
}

/**
 * Returns the plural form of a word based on a count.
 *
 * @param word The singular word.
 * @param count The count to test against.
 * @param plural Optional custom plural form (defaults to `word + 's'`).
 * @returns The singular word when `count === 1`, otherwise the plural.
 *
 * @example
 * ```typescript
 * Pluralize('cat', 1);          // 'cat'
 * Pluralize('cat', 3);          // 'cats'
 * Pluralize('child', 2, 'children'); // 'children'
 * ```
 */
export function Pluralize(word: string, count: number, plural?: string): string {
	if (!word || typeof word !== 'string') return '';
	return count === 1 ? word : (plural ?? `${word}s`);
}

/**
 * Counts the number of words in a string.
 * Words are separated by one or more whitespace characters.
 *
 * @param str The input string.
 * @returns The number of words.
 *
 * @example
 * ```typescript
 * WordCount('hello world'); // 2
 * WordCount('  foo  bar  baz  '); // 3
 * ```
 */
export function WordCount(str: string): number {
	if (!str || typeof str !== 'string') return 0;
	return str.trim().split(/\s+/u).filter(Boolean).length;
}

/**
 * Counts the number of non-overlapping occurrences of `substr` in `str`.
 *
 * @param str The string to search in.
 * @param substr The substring to count.
 * @returns The number of occurrences.
 *
 * @example
 * ```typescript
 * CountOccurrences('hello world hello', 'hello'); // 2
 * CountOccurrences('aaa', 'aa'); // 1  (non-overlapping)
 * ```
 */
export function CountOccurrences(str: string, substr: string): number {
	if (!str || !substr) return 0;
	let count = 0;
	let pos = 0;
	while ((pos = str.indexOf(substr, pos)) !== -1) {
		count++;
		pos += substr.length;
	}
	return count;
}
