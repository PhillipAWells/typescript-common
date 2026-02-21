/**
 * Time measurement utilities.
 *
 * Provides the {@link ElapsedTime} value-object for representing and formatting
 * durations, and the {@link Stopwatch} class for recording timestamped events
 * such as starts, stops, pauses, resumes, and laps.
 *
 * @module time
 */

export * from './elapsed-time/elapsed-time.js';
export * from './elapsed-time/types.js';
export * from './elapsed-time/constants.js';
export * from './elapsed-time/utils.js';
export * from './stopwatch/stopwatch.js';
export * from './stopwatch/entry.js';
export * from './stopwatch/entry-types.js';

export type {
	TUnitLabel,
	TUnitLabelString,
	TUnitLabelFunction,
	IUnitLabelMap,
	IConciseUnitLabels,
	ILongUnitLabels,
	IMediumUnitLabels,
	IShortUnitLabels,
	IDefaultUnitLabels,
	IFormatConfig,
	IFormats,
} from './elapsed-time/types.js';
