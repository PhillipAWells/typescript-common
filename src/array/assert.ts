import type { IAssertException } from '../asserts/types.js';
import { SetExceptionClass, SetExceptionMessage, ThrowException } from '../asserts/utils.js';

/**
 * Type alias for size constraint properties.
 * Represents constraints that can be applied to array dimensions.
 */
export type TSizeConstraint = {
	/** Exact size requirement */
	size?: number;
	/** Minimum size requirement (inclusive) */
	minSize?: number;
	/** Maximum size requirement (inclusive) */
	maxSize?: number;
};

/**
 * Type alias for 2D dimension constraint properties.
 * Represents constraints that can be applied to matrix dimensions.
 */
export type TDimensionConstraint = {
	/** Exact dimension requirement */
	exact?: number;
	/** Minimum dimension requirement (inclusive) */
	min?: number;
	/** Maximum dimension requirement (inclusive) */
	max?: number;
};

/**
 * Error thrown when a value is not a valid array or fails an array assertion.
 *
 * @example
 * throw new ArrayError('Value is not a valid array');
 */
export class ArrayError extends Error {
	constructor(message?: string) {
		super(message ?? 'Array assertion failed');
		this.name = 'ArrayError';
		Object.setPrototypeOf(this, ArrayError.prototype);
	}
}

/**
 * Configuration interface for array validation constraints.
 *
 * Provides flexible size constraints for array validation, allowing
 * exact size matching or range-based validation with min/max bounds.
 * All size constraints are inclusive.
 */
export interface IAssertArrayArgs {
	/** Exact number of elements the array must contain */
	size?: number;
	/** Minimum number of elements the array must contain (inclusive) */
	minSize?: number;
	/** Maximum number of elements the array must contain (inclusive) */
	maxSize?: number;
}

/**
 * Configuration interface for 2D array (matrix) validation constraints.
 *
 * Supports validation of rectangular matrices with configurable dimensions.
 * Can validate exact dimensions or enforce minimum/maximum row and column counts.
 * All dimension constraints are inclusive. Ensures all rows have uniform column count.
 */
export interface IAssertArray2DArgs {
	/** Exact number of rows the 2D array must have */
	rows?: number;
	/** Exact number of columns each row must have */
	columns?: number;
	/** Minimum number of rows the 2D array must have (inclusive) */
	minRows?: number;
	/** Minimum number of columns each row must have (inclusive) */
	minColumns?: number;
	/** Maximum number of rows the 2D array must have (inclusive) */
	maxRows?: number;
	/** Maximum number of columns each row must have (inclusive) */
	maxColumns?: number;
}

/**
 * Asserts that a value is an array, optionally validating its size.
 * @template T The type of array elements.
 * @param value The value to validate.
 * @param args Optional size constraints.
 * @param exception Optional custom exception to throw.
 * @throws {ArrayError} If the value is not an array or fails size validation.
 */
export function AssertArray<T = unknown>(value: unknown, args?: IAssertArrayArgs, exceptionInput: IAssertException = {}): asserts value is T[] {
	// Initialize exception configuration with defaults
	const exception = exceptionInput ?? {};
	SetExceptionClass(exception, ArrayError);

	// Validate that the value is an array
	if (!Array.isArray(value)) {
		SetExceptionMessage(exception, `Expected array but received ${typeof value}: ${String(value)}`);
		ThrowException(exception);
	}

	// Type cast is safe after array validation
	const array = value as T[];

	// Validate exact size constraint if specified
	if (args?.size !== undefined && array.length !== args.size) {
		SetExceptionMessage(exception, `Expected array with size ${args.size} but received size ${array.length}`);
		ThrowException(exception);
	}

	// Validate minimum size constraint if specified
	if (args?.minSize !== undefined && array.length < args.minSize) {
		SetExceptionMessage(exception, `Expected array with minimum size ${args.minSize} but received size ${array.length}`);
		ThrowException(exception);
	}

	// Validate maximum size constraint if specified
	if (args?.maxSize !== undefined && array.length > args.maxSize) {
		SetExceptionMessage(exception, `Expected array with maximum size ${args.maxSize} but received size ${array.length}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that a value is a 2D array, optionally validating its dimensions.
 * @template T The type of array elements.
 * @param value The value to validate.
 * @param args Optional dimension constraints.
 * @param exception Optional custom exception to throw.
 * @throws {ArrayError} If the value is not a 2D array or fails dimension validation.
 */
export function AssertArray2D<T = unknown>(value: unknown, args: IAssertArray2DArgs = {}, exception: IAssertException = {}): asserts value is T[][] {
	// Initialize exception configuration with defaults
	SetExceptionClass(exception, ArrayError);

	// Validate that the value is an array
	if (!Array.isArray(value)) {
		SetExceptionMessage(exception, `Expected array but received ${typeof value}: ${String(value)}`);
		ThrowException(exception);
	}

	// Type cast is safe after array validation
	const array = value as unknown[];

	// Validate that all elements are arrays (making it 2D)
	if (!array.every((row: unknown) => Array.isArray(row))) {
		let invalidPositions = array.map((row, idx) => {
			if (!Array.isArray(row)) return idx;
			return null;
		});
		invalidPositions = invalidPositions.filter((idx) => idx !== null);
		SetExceptionMessage(exception, `Expected 2D array but found non-array elements at positions: ${invalidPositions.join(', ')}`);
		ThrowException(exception);
	}

	// Type cast is safe after 2D validation
	const array2d = array as unknown[][];
	const rows = array2d.length;
	const [firstRow] = array2d;
	const columns = firstRow ? firstRow.length : 0;

	// Validate rectangular matrix structure (all rows have same column count)
	if (!array2d.every((row: unknown[]) => row.length === columns)) {
		SetExceptionMessage(exception, 'Array is not rectangular - rows have different column counts');
		ThrowException(exception);
	}

	// Validate exact row count constraint if specified
	if (args?.rows !== undefined && rows !== args.rows) {
		SetExceptionMessage(exception, `Array has ${rows} rows, expected exactly ${args.rows}`);
		ThrowException(exception);
	}

	// Validate exact column count constraint if specified
	if (args?.columns !== undefined && columns !== args.columns) {
		SetExceptionMessage(exception, `Array has ${columns} columns, expected exactly ${args.columns}`);
		ThrowException(exception);
	}

	// Validate minimum row count constraint if specified
	if (args?.minRows !== undefined && rows < args.minRows) {
		SetExceptionMessage(exception, `Array has ${rows} rows, minimum required is ${args.minRows}`);
		ThrowException(exception);
	}

	// Validate maximum row count constraint if specified
	if (args?.maxRows !== undefined && rows > args.maxRows) {
		SetExceptionMessage(exception, `Array has ${rows} rows, maximum allowed is ${args.maxRows}`);
		ThrowException(exception);
	}

	// Validate minimum column count constraint if specified
	if (args?.minColumns !== undefined && columns < args.minColumns) {
		SetExceptionMessage(exception, `Array has ${columns} columns, minimum required is ${args.minColumns}`);
		ThrowException(exception);
	}

	// Validate maximum column count constraint if specified
	if (args?.maxColumns !== undefined && columns > args.maxColumns) {
		SetExceptionMessage(exception, `Array has ${columns} columns, maximum allowed is ${args.maxColumns}`);
		ThrowException(exception);
	}
}

/**
 * Asserts that an array is not empty.
 * @template T The type of array elements.
 * @param value The array to validate.
 * @param exception Optional custom exception to throw.
 * @throws {ArrayError} If the array is empty.
 */
export function AssertArrayNotEmpty<T>(value: T[] | unknown, exception: IAssertException = {}): asserts value is T[] {
	// Initialize exception configuration with defaults
	SetExceptionClass(exception, ArrayError);

	// First validate that it's an array using the base AssertArray function
	AssertArray(value, undefined, exception);

	// Then check if the array is empty
	if (value.length === 0) {
		SetExceptionMessage(exception, 'Array should not be empty');
		ThrowException(exception);
	}
}

/**
 * Asserts that all elements in an array satisfy a predicate.
 * @template T The type of array elements.
 * @param array The array to validate.
 * @param predicate A function to test each element.
 * @param exception Optional custom exception to throw.
 * @throws {ArrayError} If any element fails the predicate test.
 */
export function AssertArrayAll<T>(array: T[], predicate: (el: T, idx: number, arr: T[]) => boolean, exception: IAssertException = {}): void {
	// Initialize exception configuration with defaults
	SetExceptionClass(exception, ArrayError);

	// Validate that the value is an array
	if (!Array.isArray(array)) {
		SetExceptionMessage(exception, 'Value is not an array');
		ThrowException(exception);
	}

	// Check if all elements satisfy the predicate
	if (!array.every(predicate)) {
		SetExceptionMessage(exception, 'Not all elements satisfy the predicate condition');
		ThrowException(exception);
	}
}

/**
 * Asserts that at least one element in an array satisfies a predicate.
 * @template T The type of array elements.
 * @param array The array to validate.
 * @param predicate A function to test each element.
 * @param exception Optional custom exception to throw.
 * @throws {ArrayError} If no elements pass the predicate test.
 */
export function AssertArrayAny<T>(array: T[], predicate: (el: T, idx: number, arr: T[]) => boolean, exception: IAssertException = {}): void {
	// Initialize exception configuration with defaults
	SetExceptionClass(exception, ArrayError);

	// Validate that the value is an array
	if (!Array.isArray(array)) {
		SetExceptionMessage(exception, 'Value is not an array');
		ThrowException(exception);
	}

	// Check if any elements satisfy the predicate
	if (!array.some(predicate)) {
		SetExceptionMessage(exception, 'No elements satisfy the predicate condition');
		ThrowException(exception);
	}
}
