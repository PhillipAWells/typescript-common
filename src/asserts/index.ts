/**
 * @fileoverview Main entry point for the asserts package.
 * Provides assertion utilities for various data types including arrays, booleans, numbers, objects, and strings.
 */

/**
 * Export all array assertion functions and types
 */
export * from '../array/assert.js';

/**
 * Export all boolean assertion functions and types
 */
export * from '../boolean/assert.js';

/**
 * Export all generic assertion functions and types
 */
export * from './generic.js';

/**
 * Export all number assertion functions and types
 */
export * from '../number/assert.js';

/**
 * Export all object assertion functions and types
 */
export * from '../object/assert.js';

/**
 * Export all string assertion functions and types
 */
export * from '../string/assert.js';

/**
 * Export type definitions and interfaces
 */
export * from './types.js';

/**
 * Export utility functions for advanced usage
 */
export * from './utils.js';

/**
 * Export error classes for standardized error handling
 */
export * from './errors.js';
