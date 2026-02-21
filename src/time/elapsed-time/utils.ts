import { ITimeElapsedFormatOptions } from './types.js';

/**
 * Apply default options to format options object.
 * Merges user-provided options with sensible defaults for time formatting.
 *
 * @param options - Partial formatting options of type ITimeElapsedFormatOptions provided by the user
 * @returns Complete formatting options with defaults applied
 *
 * @example
 * ```typescript
 * const userOptions = { showZeroValues: true };
 * const complete = ApplyDefaultOptions(userOptions);
 * // Result: { negativeValueFormat: 'NegativeSign', showZeroValues: true, maxUnits: undefined, unitLabels: undefined }
 * ```
 */
function ApplyDefaultOptions(options: Partial<ITimeElapsedFormatOptions>): ITimeElapsedFormatOptions {
	return {
		maxUnits: options.maxUnits,
		negativeValueFormat: options.negativeValueFormat ?? 'NegativeSign',
		showZeroValues: options.showZeroValues ?? false,
		unitLabels: options.unitLabels,
	};
}

export { ApplyDefaultOptions };
