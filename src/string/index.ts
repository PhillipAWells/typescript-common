/**
 * String utility functions and types.
 *
 * Provides helpers for case conversion (camelCase, PascalCase, kebab-case),
 * HTML escaping, template formatting, truncation, padding, slugification,
 * string reversal, and common validation predicates.
 *
 * @module string
 */

export * from './case-conversion.js';
export * from './validation.js';
export * from './formatting.js';
export * from './transformation.js';

export type { TStringValidator, TStringFormatter, TStringTransformer, TCaseConverter, TStringPredicate, TFormatValue, TFormatParams, TFormatArgs } from './types.js';
