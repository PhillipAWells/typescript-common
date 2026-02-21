import { describe, it, expect } from 'vitest';
import { CamelCase, CAPITALIZE, KEBAB_CASE, PASCAL_CASE, SNAKE_CASE, SCREAMING_SNAKE_CASE } from './case-conversion.js';
import { EscapeHTML, FormatString, TruncateString, PadString, StripHTML, Pluralize, WordCount, CountOccurrences } from './formatting.js';
import { REVERSE_STRING, SLUGIFY } from './transformation.js';
import { IS_BLANK_STRING, IS_HEX_STRING } from './validation.js';

describe('CamelCase', () => {
	it('converts space-separated words', () => {
		expect(CamelCase('hello world')).toBe('helloWorld');
	});

	it('converts kebab-case', () => {
		expect(CamelCase('foo-bar-baz')).toBe('fooBarBaz');
	});

	it('converts snake_case', () => {
		expect(CamelCase('hello_world')).toBe('helloWorld');
	});

	it('returns empty string for empty input', () => {
		expect(CamelCase('')).toBe('');
	});

	it('returns empty string for null/falsy input', () => {
		expect(CamelCase(null as any)).toBe('');
	});

	it('lowercases the first letter', () => {
		expect(CamelCase('HelloWorld')[0]).toBe('h');
	});
});

describe('CAPITALIZE', () => {
	it('capitalizes the first letter', () => {
		expect(CAPITALIZE('hello')).toBe('Hello');
	});

	it('does not alter rest of the string', () => {
		expect(CAPITALIZE('hello world')).toBe('Hello world');
	});

	it('returns empty string for empty input', () => {
		expect(CAPITALIZE('')).toBe('');
	});

	it('returns empty string for null input', () => {
		expect(CAPITALIZE(null as any)).toBe('');
	});

	it('handles already-capitalized strings', () => {
		expect(CAPITALIZE('Hello')).toBe('Hello');
	});
});

describe('KEBAB_CASE', () => {
	it('converts camelCase to kebab-case', () => {
		expect(KEBAB_CASE('helloWorld')).toBe('hello-world');
	});

	it('converts spaces to dashes', () => {
		expect(KEBAB_CASE('hello world')).toBe('hello-world');
	});

	it('converts underscores to dashes', () => {
		expect(KEBAB_CASE('hello_world')).toBe('hello-world');
	});

	it('lowercases everything', () => {
		expect(KEBAB_CASE('HELLO')).toBe('hello');
	});

	it('returns empty string for empty/null input', () => {
		expect(KEBAB_CASE('')).toBe('');
		expect(KEBAB_CASE(null as any)).toBe('');
	});
});

describe('PASCAL_CASE', () => {
	it('converts space-separated words', () => {
		expect(PASCAL_CASE('hello world')).toBe('HelloWorld');
	});

	it('converts kebab-case', () => {
		expect(PASCAL_CASE('foo-bar')).toBe('FooBar');
	});

	it('converts snake_case', () => {
		expect(PASCAL_CASE('foo_bar')).toBe('FooBar');
	});

	it('capitalizes first letter', () => {
		expect(PASCAL_CASE('hello')[0]).toBe('H');
	});

	it('returns empty string for empty/null input', () => {
		expect(PASCAL_CASE('')).toBe('');
		expect(PASCAL_CASE(null as any)).toBe('');
	});
});

describe('EscapeHTML', () => {
	it('escapes ampersands', () => {
		expect(EscapeHTML('a & b')).toBe('a &amp; b');
	});

	it('escapes angle brackets', () => {
		expect(EscapeHTML('<div>')).toBe('&lt;div&gt;');
	});

	it('escapes double quotes', () => {
		expect(EscapeHTML('"hello"')).toBe('&quot;hello&quot;');
	});

	it('escapes single quotes', () => {
		expect(EscapeHTML('it\'s')).toBe('it&#039;s');
	});

	it('returns empty string for empty/null input', () => {
		expect(EscapeHTML('')).toBe('');
		expect(EscapeHTML(null as any)).toBe('');
	});

	it('does not alter a string with no special chars', () => {
		expect(EscapeHTML('hello world')).toBe('hello world');
	});
});

describe('FormatString', () => {
	it('replaces named placeholders', () => {
		expect(FormatString('Hello {name}!', { name: 'World' })).toBe('Hello World!');
	});

	it('replaces positional placeholders', () => {
		expect(FormatString('Hello {0}!', ['World'])).toBe('Hello World!');
	});

	it('handles multiple named params', () => {
		expect(FormatString('{greeting} {name}', { greeting: 'Hi', name: 'Alice' })).toBe('Hi Alice');
	});

	it('handles multiple positional params', () => {
		expect(FormatString('{0} {1}', ['foo', 'bar'])).toBe('foo bar');
	});

	it('leaves unknown placeholders unchanged', () => {
		expect(FormatString('Hello {unknown}!', {})).toBe('Hello {unknown}!');
	});

	it('converts boolean and number values to strings', () => {
		expect(FormatString('Count: {count}, Active: {active}', { count: 42, active: true })).toBe('Count: 42, Active: true');
	});

	it('returns empty string for empty/null template', () => {
		expect(FormatString('', { name: 'x' })).toBe('');
		expect(FormatString(null as any, {})).toBe('');
	});
});

describe('TruncateString', () => {
	it('truncates strings exceeding maxLength', () => {
		expect(TruncateString('Hello World', 5)).toBe('Hello...');
	});

	it('returns the original string when within maxLength', () => {
		expect(TruncateString('Hi', 10)).toBe('Hi');
	});

	it('uses a custom ellipsis', () => {
		expect(TruncateString('Hello World', 5, '…')).toBe('Hello…');
	});

	it('returns empty string for empty/null input', () => {
		expect(TruncateString('', 5)).toBe('');
		expect(TruncateString(null as any, 5)).toBe('');
	});

	it('returns empty string when maxLength <= 0', () => {
		expect(TruncateString('hello', 0)).toBe('');
	});
});

describe('PadString', () => {
	it('pads to the end by default', () => {
		expect(PadString('hi', 5)).toBe('hi   ');
	});

	it('pads to the start when padEnd is false', () => {
		expect(PadString('hi', 5, ' ', false)).toBe('   hi');
	});

	it('uses a custom pad character', () => {
		expect(PadString('hi', 5, '0')).toBe('hi000');
	});

	it('returns the original string when length is already met', () => {
		expect(PadString('hello', 3)).toBe('hello');
	});

	it('returns empty string for null input', () => {
		expect(PadString(null as any, 5)).toBe('');
	});
});

describe('REVERSE_STRING', () => {
	it('reverses a string', () => {
		expect(REVERSE_STRING('hello')).toBe('olleh');
	});

	it('handles single characters', () => {
		expect(REVERSE_STRING('a')).toBe('a');
	});

	it('handles empty strings', () => {
		expect(REVERSE_STRING('')).toBe('');
	});

	it('returns empty string for null', () => {
		expect(REVERSE_STRING(null as any)).toBe('');
	});

	it('handles palindromes', () => {
		expect(REVERSE_STRING('racecar')).toBe('racecar');
	});
});

describe('SLUGIFY', () => {
	it('converts to lowercase and replaces spaces with dashes', () => {
		expect(SLUGIFY('Hello World')).toBe('hello-world');
	});

	it('removes special characters', () => {
		expect(SLUGIFY('Hello, World!')).toBe('hello-world');
	});

	it('collapses multiple spaces and dashes', () => {
		expect(SLUGIFY('foo  bar -- baz')).toBe('foo-bar-baz');
	});

	it('trims leading/trailing dashes', () => {
		expect(SLUGIFY('--hello world--')).toBe('hello-world');
	});

	it('returns empty string for empty/null input', () => {
		expect(SLUGIFY('')).toBe('');
		expect(SLUGIFY(null as any)).toBe('');
	});
});

describe('IS_BLANK_STRING', () => {
	it('returns true for an empty string', () => {
		expect(IS_BLANK_STRING('')).toBe(true);
	});

	it('returns true for whitespace-only strings', () => {
		expect(IS_BLANK_STRING('   ')).toBe(true);
		expect(IS_BLANK_STRING('\t\n')).toBe(true);
	});

	it('returns false for non-blank strings', () => {
		expect(IS_BLANK_STRING('hello')).toBe(false);
		expect(IS_BLANK_STRING('  hi  ')).toBe(false);
	});

	it('returns true for null/undefined', () => {
		expect(IS_BLANK_STRING(null as any)).toBe(true);
		expect(IS_BLANK_STRING(undefined as any)).toBe(true);
	});
});

describe('IS_HEX_STRING', () => {
	it('returns true for plain hex digits', () => {
		expect(IS_HEX_STRING('1a2b3c')).toBe(true);
		expect(IS_HEX_STRING('DEADBEEF')).toBe(true);
	});

	it('returns true for # prefixed hex', () => {
		expect(IS_HEX_STRING('#ff0000')).toBe(true);
	});

	it('returns true for 0x prefixed hex', () => {
		expect(IS_HEX_STRING('0xff')).toBe(true);
	});

	it('returns false for non-hex strings', () => {
		expect(IS_HEX_STRING('hello')).toBe(false);
		expect(IS_HEX_STRING('xyz')).toBe(false);
	});

	it('returns false for empty string', () => {
		expect(IS_HEX_STRING('')).toBe(false);
	});
});

describe('SNAKE_CASE', () => {
	it('converts camelCase to snake_case', () => {
		expect(SNAKE_CASE('helloWorld')).toBe('hello_world');
	});

	it('converts spaces to underscores', () => {
		expect(SNAKE_CASE('hello world')).toBe('hello_world');
	});

	it('converts kebab-case to snake_case', () => {
		expect(SNAKE_CASE('hello-world')).toBe('hello_world');
	});

	it('lowercases everything', () => {
		expect(SNAKE_CASE('HelloWorld')).toBe('hello_world');
	});

	it('returns empty string for empty/null input', () => {
		expect(SNAKE_CASE('')).toBe('');
		expect(SNAKE_CASE(null as any)).toBe('');
	});
});

describe('SCREAMING_SNAKE_CASE', () => {
	it('converts camelCase to SCREAMING_SNAKE_CASE', () => {
		expect(SCREAMING_SNAKE_CASE('helloWorld')).toBe('HELLO_WORLD');
	});

	it('converts spaces', () => {
		expect(SCREAMING_SNAKE_CASE('hello world')).toBe('HELLO_WORLD');
	});

	it('returns empty string for empty/null input', () => {
		expect(SCREAMING_SNAKE_CASE('')).toBe('');
		expect(SCREAMING_SNAKE_CASE(null as any)).toBe('');
	});
});

describe('StripHTML', () => {
	it('removes HTML tags', () => {
		expect(StripHTML('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
	});

	it('handles self-closing tags', () => {
		expect(StripHTML('Line1<br/>Line2')).toBe('Line1Line2');
	});

	it('returns string unchanged when no tags', () => {
		expect(StripHTML('plain text')).toBe('plain text');
	});

	it('returns empty string for empty/null input', () => {
		expect(StripHTML('')).toBe('');
		expect(StripHTML(null as any)).toBe('');
	});
});

describe('Pluralize', () => {
	it('returns singular when count is 1', () => {
		expect(Pluralize('cat', 1)).toBe('cat');
	});

	it('returns plural form when count is not 1', () => {
		expect(Pluralize('cat', 0)).toBe('cats');
		expect(Pluralize('cat', 2)).toBe('cats');
	});

	it('uses custom plural when provided', () => {
		expect(Pluralize('child', 3, 'children')).toBe('children');
	});

	it('returns empty string for empty/null input', () => {
		expect(Pluralize('', 2)).toBe('');
		expect(Pluralize(null as any, 2)).toBe('');
	});
});

describe('WordCount', () => {
	it('counts words', () => {
		expect(WordCount('hello world')).toBe(2);
	});

	it('handles extra whitespace', () => {
		expect(WordCount('  foo  bar  baz  ')).toBe(3);
	});

	it('returns 0 for empty string', () => {
		expect(WordCount('')).toBe(0);
		expect(WordCount('   ')).toBe(0);
	});

	it('returns 0 for null input', () => {
		expect(WordCount(null as any)).toBe(0);
	});
});

describe('CountOccurrences', () => {
	it('counts non-overlapping occurrences', () => {
		expect(CountOccurrences('hello world hello', 'hello')).toBe(2);
	});

	it('returns 0 when substring is not found', () => {
		expect(CountOccurrences('hello', 'xyz')).toBe(0);
	});

	it('counts non-overlapping matches', () => {
		expect(CountOccurrences('aaa', 'aa')).toBe(1);
	});

	it('returns 0 for empty inputs', () => {
		expect(CountOccurrences('', 'a')).toBe(0);
		expect(CountOccurrences('hello', '')).toBe(0);
	});
});
