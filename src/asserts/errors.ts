/**
 * Base error class for all custom errors
 */
export class BaseError extends Error {
	public readonly Code: string;

	public readonly Context: Record<string, unknown> | undefined;
	
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
 * Error thrown when validation fails
 */
export class ValidationError extends BaseError {
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'VALIDATION_ERROR', context);
	}
}

/**
 * Error thrown when a type assertion fails
 */
export class AssertionError extends BaseError {
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'ASSERTION_ERROR', context);
	}
}

/**
 * Error thrown when an argument is invalid
 */
export class InvalidArgumentError extends BaseError {
	constructor(argumentName: string, reason: string, context?: Record<string, unknown>) {
		super(`Invalid argument '${argumentName}': ${reason}`, 'INVALID_ARGUMENT', context);
	}
}

/**
 * Error thrown when an operation is not supported
 */
export class NotSupportedError extends BaseError {
	constructor(operation: string, context?: Record<string, unknown>) {
		super(`Operation not supported: ${operation}`, 'NOT_SUPPORTED', context);
	}
}

/**
 * Error thrown when a required value is not found
 */
export class NotFoundError extends BaseError {
	constructor(item: string, context?: Record<string, unknown>) {
		super(`Not found: ${item}`, 'NOT_FOUND', context);
	}
}

/**
 * Error thrown when buffer overflow occurs
 */
export class BufferOverflowError extends BaseError {
	constructor(maxSize: number, context?: Record<string, unknown>) {
		super(`Buffer overflow: maximum size ${maxSize} exceeded`, 'BUFFER_OVERFLOW', context);
	}
}
