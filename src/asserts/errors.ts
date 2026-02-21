/**
 * Base error class for all custom errors in the assertion library.
 *
 * Extends the built-in `Error` with a machine-readable `Code` string and an
 * optional `Context` bag for structured diagnostic metadata. All other error
 * classes in this module extend `BaseError`.
 *
 * @example
 * ```typescript
 * class MyError extends BaseError {
 *   constructor(message: string) {
 *     super(message, 'MY_ERROR');
 *   }
 * }
 * throw new MyError('Something went wrong');
 * ```
 */
export class BaseError extends Error {
	public readonly Code: string;

	public readonly Context: Record<string, unknown> | undefined;

	/**
	 * @param message - Human-readable description of the error
	 * @param code - Machine-readable error code (e.g. `'VALIDATION_ERROR'`)
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(message: string, code: string, context?: Record<string, unknown>) {
		super(message);
		this.name = this.constructor.name;
		this.Code = code;
		this.Context = context;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

/**
 * Error thrown when input data fails a validation rule.
 *
 * @example
 * ```typescript
 * throw new ValidationError('Email address is not valid', { field: 'email' });
 * ```
 */
export class ValidationError extends BaseError {
	/**
	 * @param message - Description of the validation failure
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'VALIDATION_ERROR', context);
	}
}

/**
 * Error thrown when a runtime type assertion fails.
 *
 * @example
 * ```typescript
 * throw new AssertionError('Expected string but received number');
 * ```
 */
export class AssertionError extends BaseError {
	/**
	 * @param message - Description of the failed assertion
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'ASSERTION_ERROR', context);
	}
}

/**
 * Error thrown when a function argument is invalid.
 * The error message is auto-formatted as
 * `"Invalid argument '<argumentName>': <reason>"`.
 *
 * @example
 * ```typescript
 * throw new InvalidArgumentError('userId', 'must be a positive integer');
 * // message: "Invalid argument 'userId': must be a positive integer"
 * ```
 */
export class InvalidArgumentError extends BaseError {
	/**
	 * @param argumentName - Name of the invalid argument
	 * @param reason - Explanation of why the argument is invalid
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(argumentName: string, reason: string, context?: Record<string, unknown>) {
		super(`Invalid argument '${argumentName}': ${reason}`, 'INVALID_ARGUMENT', context);
	}
}

/**
 * Error thrown when a requested operation is not supported in the current context.
 * The error message is auto-formatted as `"Operation not supported: <operation>"`.
 *
 * @example
 * ```typescript
 * throw new NotSupportedError('bulk delete in read-only mode');
 * // message: "Operation not supported: bulk delete in read-only mode"
 * ```
 */
export class NotSupportedError extends BaseError {
	/**
	 * @param operation - Description of the unsupported operation
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(operation: string, context?: Record<string, unknown>) {
		super(`Operation not supported: ${operation}`, 'NOT_SUPPORTED', context);
	}
}

/**
 * Error thrown when a required resource or value cannot be found.
 * The error message is auto-formatted as `"Not found: <item>"`.
 *
 * @example
 * ```typescript
 * throw new NotFoundError('user with id 42');
 * // message: "Not found: user with id 42"
 * ```
 */
export class NotFoundError extends BaseError {
	/**
	 * @param item - Description of the resource that was not found
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(item: string, context?: Record<string, unknown>) {
		super(`Not found: ${item}`, 'NOT_FOUND', context);
	}
}

/**
 * Error thrown when a buffer or collection exceeds its maximum capacity.
 * The error message is auto-formatted as
 * `"Buffer overflow: maximum size <maxSize> exceeded"`.
 *
 * @example
 * ```typescript
 * throw new BufferOverflowError(1000);
 * // message: "Buffer overflow: maximum size 1000 exceeded"
 * ```
 */
export class BufferOverflowError extends BaseError {
	/**
	 * @param maxSize - The maximum capacity that was exceeded
	 * @param context - Optional structured metadata for diagnostics
	 */
	constructor(maxSize: number, context?: Record<string, unknown>) {
		super(`Buffer overflow: maximum size ${maxSize} exceeded`, 'BUFFER_OVERFLOW', context);
	}
}
