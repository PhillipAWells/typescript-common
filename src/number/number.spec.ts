import { describe, it, expect } from 'vitest';
import { AssertNumber, NumberError, NumberRangeError } from './assert.js';

describe('AssertNumber', () => {
	it('passes for valid numbers', () => {
		expect(() => AssertNumber(42)).not.toThrow();
		expect(() => AssertNumber(0)).not.toThrow();
		expect(() => AssertNumber(-42)).not.toThrow();
		expect(() => AssertNumber(3.14)).not.toThrow();
	});

	it('throws for non-number values', () => {
		expect(() => AssertNumber('42')).toThrow(NumberError);
		expect(() => AssertNumber(true)).toThrow(NumberError);
		expect(() => AssertNumber(null)).toThrow(NumberError);
		expect(() => AssertNumber(undefined)).toThrow(NumberError);
		expect(() => AssertNumber([])).toThrow(NumberError);
		expect(() => AssertNumber({})).toThrow(NumberError);
	});

	it('throws for NaN', () => {
		expect(() => AssertNumber(NaN)).toThrow(NumberError);
	});

	it('throws for Infinity when finite is true', () => {
		expect(() => AssertNumber(Infinity, { finite: true })).toThrow(NumberRangeError);
		expect(() => AssertNumber(-Infinity, { finite: true })).toThrow(NumberRangeError);
	});

	it('passes for Infinity when finite is not specified', () => {
		expect(() => AssertNumber(Infinity)).not.toThrow();
		expect(() => AssertNumber(-Infinity)).not.toThrow();
	});

	it('validates integer constraint', () => {
		expect(() => AssertNumber(42, { integer: true })).not.toThrow();
		expect(() => AssertNumber(3.14, { integer: true })).toThrow(NumberRangeError);
		expect(() => AssertNumber(0, { integer: true })).not.toThrow();
	});

	it('validates greater than constraint (gt)', () => {
		expect(() => AssertNumber(50, { gt: 40 })).not.toThrow();
		expect(() => AssertNumber(40, { gt: 40 })).toThrow(NumberRangeError);
		expect(() => AssertNumber(39, { gt: 40 })).toThrow(NumberRangeError);
	});

	it('validates greater than or equal constraint (gte)', () => {
		expect(() => AssertNumber(50, { gte: 40 })).not.toThrow();
		expect(() => AssertNumber(40, { gte: 40 })).not.toThrow();
		expect(() => AssertNumber(39, { gte: 40 })).toThrow(NumberRangeError);
	});

	it('validates less than constraint (lt)', () => {
		expect(() => AssertNumber(30, { lt: 40 })).not.toThrow();
		expect(() => AssertNumber(40, { lt: 40 })).toThrow(NumberRangeError);
		expect(() => AssertNumber(50, { lt: 40 })).toThrow(NumberRangeError);
	});

	it('validates less than or equal constraint (lte)', () => {
		expect(() => AssertNumber(30, { lte: 40 })).not.toThrow();
		expect(() => AssertNumber(40, { lte: 40 })).not.toThrow();
		expect(() => AssertNumber(50, { lte: 40 })).toThrow(NumberRangeError);
	});

	it('validates equality constraint (eq)', () => {
		expect(() => AssertNumber(42, { eq: 42 })).not.toThrow();
		expect(() => AssertNumber(42.0, { eq: 42 })).not.toThrow();
		expect(() => AssertNumber(41, { eq: 42 })).toThrow(NumberRangeError);
		expect(() => AssertNumber(43, { eq: 42 })).toThrow(NumberRangeError);
	});

	it('validates multiple constraints together (AND logic)', () => {
		expect(() => AssertNumber(50, { gte: 0, lte: 100 })).not.toThrow();
		expect(() => AssertNumber(-1, { gte: 0, lte: 100 })).toThrow(NumberRangeError);
		expect(() => AssertNumber(101, { gte: 0, lte: 100 })).toThrow(NumberRangeError);
	});

	it('validates complex range constraints', () => {
		expect(() => AssertNumber(50, { gt: 0, lt: 100 })).not.toThrow();
		expect(() => AssertNumber(0, { gt: 0, lt: 100 })).toThrow(NumberRangeError);
		expect(() => AssertNumber(100, { gt: 0, lt: 100 })).toThrow(NumberRangeError);
	});

	it('validates finite + integer + range together', () => {
		expect(() => AssertNumber(50, { finite: true, integer: true, gte: 0, lte: 100 })).not.toThrow();
		expect(() => AssertNumber(50.5, { finite: true, integer: true, gte: 0, lte: 100 })).toThrow(NumberRangeError);
		expect(() => AssertNumber(-1, { finite: true, integer: true, gte: 0, lte: 100 })).toThrow(NumberRangeError);
	});

	it('narrows type correctly', () => {
		const value: unknown = 42;
		AssertNumber(value);
		// TypeScript now knows value is number
		const result: number = value;
		expect(result).toBe(42);
	});

	it('supports custom error message', () => {
		const customMessage = 'Custom number error';
		expect(() => AssertNumber('not a number', {}, { message: customMessage })).toThrow(customMessage);
	});

	it('supports custom error class', () => {
		class CustomError extends Error {
			constructor(message?: string) {
				super(message);
				this.name = 'CustomError';
			}
		}

		expect(() => AssertNumber('not a number', {}, { class: CustomError as any })).toThrow(CustomError);
	});

	it('error message includes actual type for non-numbers', () => {
		expect(() => AssertNumber('42')).toThrow(/string/);
	});

	it('practical use case: validate age', () => {
		function validateAge(age: unknown) {
			AssertNumber(age, { finite: true, integer: true, gte: 0, lte: 150 });
		}

		expect(() => validateAge(25)).not.toThrow();
		expect(() => validateAge(0)).not.toThrow();
		expect(() => validateAge(150)).not.toThrow();
		expect(() => validateAge(-1)).toThrow();
		expect(() => validateAge(151)).toThrow();
		expect(() => validateAge(25.5)).toThrow();
	});

	it('practical use case: validate percentage', () => {
		function validatePercentage(pct: unknown) {
			AssertNumber(pct, { finite: true, gte: 0, lte: 100 });
		}

		expect(() => validatePercentage(0)).not.toThrow();
		expect(() => validatePercentage(50)).not.toThrow();
		expect(() => validatePercentage(100)).not.toThrow();
		expect(() => validatePercentage(-1)).toThrow();
		expect(() => validatePercentage(101)).toThrow();
	});

	it('practical use case: validate array index', () => {
		function validateArrayIndex(index: unknown) {
			AssertNumber(index, { integer: true, gte: 0 });
		}

		expect(() => validateArrayIndex(0)).not.toThrow();
		expect(() => validateArrayIndex(5)).not.toThrow();
		expect(() => validateArrayIndex(-1)).toThrow();
		expect(() => validateArrayIndex(3.5)).toThrow();
	});

	it('throws NumberError for type mismatches, NumberRangeError for range violations', () => {
		expect(() => AssertNumber('string')).toThrow(NumberError);
		expect(() => AssertNumber(NaN)).toThrow(NumberError);
		expect(() => AssertNumber(42, { gte: 50 })).toThrow(NumberRangeError);
	});
});
