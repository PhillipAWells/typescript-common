import { describe, it, expect } from 'vitest';
import { EnumEntries } from './enum-entries.js';
import { EnumKeyByValue } from './enum-key-by-value.js';
import { EnumKeys } from './enum-keys.js';
import { EnumSafeValue } from './enum-safe-value.js';
import { EnumValues } from './enum-values.js';
import { ValidateEnumValue } from './validate-enum-value.js';

enum Direction {
	Up = 'UP',
	Down = 'DOWN',
	Left = 'LEFT',
	Right = 'RIGHT',
}

enum Status {
	Active = 1,
	Inactive = 2,
	Pending = 3,
}

describe('EnumEntries', () => {
	it('returns key-value pairs for a string enum', () => {
		const entries = EnumEntries(Direction);
		expect(entries).toEqual([
			['Up', 'UP'],
			['Down', 'DOWN'],
			['Left', 'LEFT'],
			['Right', 'RIGHT'],
		]);
	});

	it('filters out numeric reverse-mapping keys', () => {
		const entries = EnumEntries(Status);
		// Numeric enums have reverse mappings like { 1: 'Active', Active: 1 }
		// EnumEntries should return only the non-numeric ones
		entries.forEach(([key]) => {
			expect(Number.isNaN(Number(key))).toBe(true);
		});
		expect(entries).toHaveLength(3);
	});

	it('returns empty array for null/undefined input', () => {
		expect(EnumEntries(null as any)).toEqual([]);
	});
});

describe('EnumKeys', () => {
	it('returns keys for a string enum', () => {
		expect(EnumKeys(Direction)).toEqual(['Up', 'Down', 'Left', 'Right']);
	});

	it('returns only non-numeric keys for a numeric enum', () => {
		const keys = EnumKeys(Status);
		expect(keys).toEqual(['Active', 'Inactive', 'Pending']);
	});

	it('returns empty array for null input', () => {
		expect(EnumKeys(null as any)).toEqual([]);
	});
});

describe('EnumValues', () => {
	it('returns values for a string enum', () => {
		expect(EnumValues(Direction)).toEqual(['UP', 'DOWN', 'LEFT', 'RIGHT']);
	});

	it('returns numeric values for a numeric enum', () => {
		expect(EnumValues(Status)).toEqual([1, 2, 3]);
	});

	it('returns empty array for null input', () => {
		expect(EnumValues(null as any)).toEqual([]);
	});
});

describe('ValidateEnumValue', () => {
	it('returns true for a valid string enum value', () => {
		expect(ValidateEnumValue(Direction, 'UP')).toBe(true);
	});

	it('returns false for an invalid value', () => {
		expect(ValidateEnumValue(Direction, 'DIAGONAL')).toBe(false);
	});

	it('returns true for a valid numeric enum value', () => {
		expect(ValidateEnumValue(Status, 1)).toBe(true);
	});

	it('returns false for an invalid numeric value', () => {
		expect(ValidateEnumValue(Status, 99)).toBe(false);
	});

	it('returns false for null/undefined value', () => {
		expect(ValidateEnumValue(Direction, null as any)).toBe(false);
		expect(ValidateEnumValue(Direction, undefined as any)).toBe(false);
	});

	it('returns false for null enum', () => {
		expect(ValidateEnumValue(null as any, 'UP')).toBe(false);
	});
});

describe('EnumKeyByValue', () => {
	it('returns key for a valid value', () => {
		expect(EnumKeyByValue(Direction, 'UP')).toBe('Up');
		expect(EnumKeyByValue(Direction, 'DOWN')).toBe('Down');
	});

	it('returns undefined for an unknown value', () => {
		expect(EnumKeyByValue(Direction, 'DIAGONAL')).toBeUndefined();
	});

	it('returns undefined for null/undefined value', () => {
		expect(EnumKeyByValue(Direction, null as any)).toBeUndefined();
		expect(EnumKeyByValue(Direction, undefined as any)).toBeUndefined();
	});

	it('returns undefined for null enum', () => {
		expect(EnumKeyByValue(null as any, 'UP')).toBeUndefined();
	});

	it('works with numeric enum', () => {
		expect(EnumKeyByValue(Status, 1)).toBe('Active');
	});
});

describe('EnumSafeValue', () => {
	it('returns the original value when valid', () => {
		expect(EnumSafeValue(Direction, 'UP', 'DOWN')).toBe('UP');
	});

	it('returns the fallback when value is invalid', () => {
		expect(EnumSafeValue(Direction, 'DIAGONAL', 'DOWN')).toBe('DOWN');
	});

	it('returns the fallback for null value', () => {
		expect(EnumSafeValue(Direction, null as any, 'UP')).toBe('UP');
	});

	it('works with numeric enums', () => {
		expect(EnumSafeValue(Status, 1, 2)).toBe(1);
		expect(EnumSafeValue(Status, 99, 2)).toBe(2);
	});
});
