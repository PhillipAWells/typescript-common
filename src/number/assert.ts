import type { IAssertException } from '../asserts/types.js';
import { SetExceptionClass, SetExceptionMessage, ThrowException } from '../asserts/utils.js';

/**
 * Error thrown when a value is not a valid number or fails basic numeric validation.
 *
 * This error is used for fundamental number validation failures, such as when
 * a value is not of type 'number', is NaN, or fails other basic numeric checks.
 * It serves as the base class for more specific number-related errors.
 *
 * @extends Error
 * @example
 * ```typescript
 * throw new NumberError('Value is not a valid number');
 * throw new NumberError('Expected number but received string');
 * ```
 */
export class NumberError extends Error {
	constructor(message?: string) {
		super(message ?? 'Value is not a valid number');
		this.name = 'NumberError';
		Object.setPrototypeOf(this, NumberError.prototype);
	}
}

/**
 * Error thrown when a numeric value is outside the expected range or bounds.
 *
 * This specialized error extends NumberError and is used specifically for
 * range validation failures, such as values being too large, too small,
 * or not matching specific equality constraints. It provides more context
 * for range-related validation failures.
 *
 * @extends NumberError
 * @example
 * ```typescript
 * throw new NumberRangeError('Value 150 exceeds maximum of 100');
 * throw new NumberRangeError('Value -5 is below minimum of 0');
 * throw new NumberRangeError('Value must be exactly 42');
 * ```
 */
export class NumberRangeError extends NumberError {
	constructor(message?: string) {
		super(message ?? 'Value is not in the expected range');
		this.name = 'NumberRangeError';
		Object.setPrototypeOf(this, NumberRangeError.prototype);
	}
}

/**
 * Type alias for numeric comparison operators.
 * Represents the available comparison operations for numeric validation.
 */
export type TNumericComparison = 'gt' | 'gte' | 'lt' | 'lte' | 'eq';

/**
 * Type alias for numeric range constraint properties.
 * Groups the range-based validation properties.
 */
export type TNumericRangeConstraints = Pick<IAssertNumberArgs, 'gt' | 'gte' | 'lt' | 'lte' | 'eq'>;

/**
 * Type alias for numeric type constraint properties.
 * Groups the type-based validation properties.
 */
export type TNumericTypeConstraints = Pick<IAssertNumberArgs, 'finite' | 'integer'>;

/**
 * Configuration interface for numeric range validation constraints.
 *
 * This interface defines the various comparison operators that can be applied
 * when validating numeric ranges. All properties are optional, allowing for
 * flexible range definitions. Multiple constraints can be combined to create
 * complex validation rules (e.g., value must be > 0 AND <= 100).
 *
 * @interface RangeArgs
 * @example
 * ```typescript
 * // Single constraint examples
 * const minOnly: RangeArgs = { gte: 0 };          // >= 0
 * const maxOnly: RangeArgs = { lt: 100 };         // < 100
 * const exactValue: RangeArgs = { eq: 42 };       // === 42
 *
 * // Multiple constraint examples
 * const range: RangeArgs = { gte: 0, lte: 100 };  // 0 <= value <= 100
 * const exclusive: RangeArgs = { gt: 0, lt: 1 };  // 0 < value < 1
 *
 * // Used with AssertNumberRange
 * AssertNumberRange(50, { gte: 0, lte: 100 }); // ✓ Valid
 * AssertNumberRange(-1, { gte: 0, lte: 100 }); // ✗ Throws
 * ```
 */
export interface IAssertNumberArgs {
	finite?: boolean; // Optional flag to assert finite number
	integer?: boolean; // Optional flag to assert integer type

	/** Value must be greater than this number (exclusive) */
	gt?: number;
	/** Value must be greater than or equal to this number (inclusive) */
	gte?: number;
	/** Value must be less than this number (exclusive) */
	lt?: number;
	/** Value must be less than or equal to this number (inclusive) */
	lte?: number;
	/** Value must be exactly equal to this number */
	eq?: number;
}

/**
 * Asserts that a numeric value meets specified constraints including type, range, and mathematical properties.
 *
 * This function validates that a number satisfies one or more conditions defined in the NumberArgs parameter.
 * It supports various validation types including finite/infinite checks, integer validation, and range
 * constraints with comparison operations. Multiple constraints are evaluated with AND logic - all specified
 * conditions must be satisfied for the assertion to pass.
 *
 * The function is particularly useful for validating user inputs, configuration values, or any numeric
 * data that must meet specific criteria. It provides clear error messages indicating which constraint
 * was violated.
 *
 * @param value - The numeric value to validate against the specified constraints
 * @param args - Object containing one or more validation rules (finite, integer, range constraints)
 * @param exception - Optional configuration for custom error handling and messages
 * @throws {NumberError} When value is not a number or is NaN
 * @throws {NumberRangeError} When value fails any of the specified constraints
 * @returns void - Function only returns if all validations pass
 *
 * @example
 * ```typescript
 * // Type validation
 * AssertNumber(42, { finite: true });       // ✓ 42 is finite
 * AssertNumber(5, { integer: true });       // ✓ 5 is an integer
 * AssertNumber(3.14, { integer: true });    // ✗ Throws: must be integer
 * AssertNumber(Infinity, { finite: true }); // ✗ Throws: must be finite
 *
 * // Range validation
 * AssertNumber(50, { gte: 0 });             // ✓ 50 >= 0
 * AssertNumber(10, { lt: 100 });            // ✓ 10 < 100
 * AssertNumber(42, { eq: 42 });             // ✓ 42 === 42
 *
 * // Combined constraints (AND logic)
 * AssertNumber(50, { finite: true, gte: 0, lte: 100 });     // ✓ finite and 0 <= 50 <= 100
 * AssertNumber(10, { integer: true, gt: 0, lt: 20 });       // ✓ integer and 0 < 10 < 20
 * AssertNumber(3.5, { integer: true, gte: 0 });             // ✗ Throws: must be integer
 *
 * // Validation failures
 * AssertNumber(-1, { gte: 0 });             // ✗ Throws: must be >= 0
 * AssertNumber(150, { lte: 100 });          // ✗ Throws: must be <= 100
 * AssertNumber(41, { eq: 42 });             // ✗ Throws: must equal 42
 * AssertNumber(50, { gt: 60 });             // ✗ Throws: must be > 60
 *
 * // Practical usage examples
 * function validateAge(age: number) {
 *   AssertNumber(age, { finite: true, integer: true, gte: 0, lte: 150 }); // Valid human age
 * }
 *
 * function validatePercentage(pct: number) {
 *   AssertNumber(pct, { finite: true, gte: 0, lte: 100 }); // 0-100%
 * }
 *
 * function validateTemperature(temp: number) {
 *   AssertNumber(temp, { finite: true, gt: -273.15 }); // Above absolute zero
 * }
 *
 * function validateArrayIndex(index: number) {
 *   AssertNumber(index, { integer: true, gte: 0 }); // Non-negative integer
 * }
 * ```
 */
export function AssertNumber(value: unknown, args: IAssertNumberArgs = {}, exception: IAssertException = {}): asserts value is number {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		SetExceptionClass(exception, NumberError);

		const actualType = Number.isNaN(value) ? 'NaN' : typeof value;
		SetExceptionMessage(exception, `Expected number but received ${actualType}: ${JSON.stringify(value)}`);
		ThrowException(exception);
	} else {
		SetExceptionClass(exception, NumberRangeError);

		// Validate finite constraint (if specified, value must be finite)
		if (args.finite === true && !Number.isFinite(value)) {
			SetExceptionMessage(exception, `Expected finite number but received ${value}`);
			ThrowException(exception);
		}

		// Validate integer constraint (if specified, value must be an integer)
		if (args.integer === true && !Number.isInteger(value)) {
			SetExceptionMessage(exception, `Expected integer but received ${value}`);
			ThrowException(exception);
		}

		// Validate equality constraint (if specified, value must exactly match)
		if (args.eq !== undefined && value !== args.eq) {
			SetExceptionMessage(exception, `Expected value to equal ${args.eq} but received ${value}`);
			ThrowException(exception);
		}

		// Validate greater than constraint (exclusive - value must be strictly greater)
		if (args.gt !== undefined && value <= args.gt) {
			SetExceptionMessage(exception, `Expected value > ${args.gt} but received ${value}`);
			ThrowException(exception);
		}

		// Validate greater than or equal constraint (inclusive - value can equal the bound)
		if (args.gte !== undefined && value < args.gte) {
			SetExceptionMessage(exception, `Expected value >= ${args.gte} but received ${value}`);
			ThrowException(exception);
		}

		// Validate less than constraint (exclusive - value must be strictly less)
		if (args.lt !== undefined && value >= args.lt) {
			SetExceptionMessage(exception, `Expected value < ${args.lt} but received ${value}`);
			ThrowException(exception);
		}

		// Validate less than or equal constraint (inclusive - value can equal the bound)
		if (args.lte !== undefined && value > args.lte) {
			SetExceptionMessage(exception, `Expected value <= ${args.lte} but received ${value}`);
			ThrowException(exception);
		}
	}
}
