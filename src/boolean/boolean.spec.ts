import { describe, it, expect } from 'vitest';
import { AssertBoolean, BooleanError } from './assert.js';

describe('AssertBoolean', () => {
	it('passes for true', () => {
		expect(() => AssertBoolean(true)).not.toThrow();
	});

	it('passes for false', () => {
		expect(() => AssertBoolean(false)).not.toThrow();
	});

	it('throws for truthy non-boolean values', () => {
		expect(() => AssertBoolean(1)).toThrow();
		expect(() => AssertBoolean('true')).toThrow();
		expect(() => AssertBoolean([])).toThrow();
		expect(() => AssertBoolean({})).toThrow();
	});

	it('throws for falsy non-boolean values', () => {
		expect(() => AssertBoolean(0)).toThrow();
		expect(() => AssertBoolean('')).toThrow();
		expect(() => AssertBoolean(null)).toThrow();
		expect(() => AssertBoolean(undefined)).toThrow();
	});

	it('throws BooleanError by default', () => {
		expect(() => AssertBoolean(1)).toThrow(BooleanError);
	});

	it('narrows type correctly for true', () => {
		const value: unknown = true;
		AssertBoolean(value);
		// TypeScript now knows value is boolean
		const result: boolean = value;
		expect(result).toBe(true);
	});

	it('narrows type correctly for false', () => {
		const value: unknown = false;
		AssertBoolean(value);
		// TypeScript now knows value is boolean
		const result: boolean = value;
		expect(result).toBe(false);
	});

	it('supports custom error message', () => {
		const customMessage = 'Custom boolean error';
		expect(() => AssertBoolean(1, { message: customMessage })).toThrow(customMessage);
	});

	it('supports custom error class', () => {
		class CustomError extends Error {
			constructor(message?: string) {
				super(message);
				this.name = 'CustomError';
			}
		}

		expect(() => AssertBoolean(1, { class: CustomError as any })).toThrow(CustomError);
	});

	it('throws for NaN', () => {
		expect(() => AssertBoolean(NaN)).toThrow();
	});

	it('throws for symbols', () => {
		expect(() => AssertBoolean(Symbol('test'))).toThrow();
	});

	it('throws for functions', () => {
		expect(() => AssertBoolean(() => {})).toThrow();
	});

	it('error message includes actual type', () => {
		expect(() => AssertBoolean(42)).toThrow(/number/);
	});
});
