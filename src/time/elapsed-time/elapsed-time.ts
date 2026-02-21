import { ITimeElapsedFormatOptions, TTimeElapsedFormats, ITimeUnitValue, IFormatConfig } from './types.js';
import { DEFAULT_UNIT_LABELS, FORMATS } from './constants.js';
import { ApplyDefaultOptions } from './utils.js';

// Time conversion constants
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const PRECISION_DECIMAL_PLACES = 3;

/**
 * Represents a duration of time with formatting and calculation capabilities.
 */
export class ElapsedTime {
	/** Whether the elapsed time represents a negative duration */
	private _IsNegative: boolean = false;

	/** The total duration in milliseconds (always positive, sign stored in isNegative) */
	private _TotalMilliseconds: number = 0;

	// Cached calculations for better performance - computed on-demand
	/** Cached total seconds value */
	private _TotalSeconds: number = 0;

	/** Cached total minutes value */
	private _TotalMinutes: number = 0;

	/** Cached total hours value */
	private _TotalHours: number = 0;

	/** Cached total days value */
	private _TotalDays: number = 0;

	/** Cached seconds component (excluding complete minutes) */
	private _Seconds: number = 0;

	/** Cached minutes component (excluding complete hours) */
	private _Minutes: number = 0;

	/** Cached hours component (excluding complete days) */
	private _Hours: number = 0;

	/** Cached days component (excluding complete weeks) */
	private _Days: number = 0;

	/** Cached weeks component */
	private _Weeks: number = 0;

	/** Cached milliseconds component (excluding complete seconds) */
	private _Milliseconds: number = 0;

	/** Flag to track whether cached values have been calculated */
	private _ValuesCalculated: boolean = false;

	/**
	 * Creates a new ElapsedTime instance.
	 * @param milliseconds The total number of milliseconds.
	 */
	constructor(milliseconds: number) {
		this._TotalMilliseconds = Math.abs(milliseconds);
		this._IsNegative = milliseconds < 0;
	}

	/**
	 * Calculate all time unit values for efficient access.
	 * This method performs the core time decomposition calculations and caches
	 * the results to avoid redundant computation on subsequent property access.
	 *
	 * The calculation process:
	 * 1. Converts total milliseconds to larger units (seconds, minutes, hours, days)
	 * 2. Calculates component values using modulo operations
	 * 3. Caches all results with the _valuesCalculated flag
	 *
	 * @private
	 *
	 * @example
	 * ```typescript
	 * // Internal usage - called automatically when accessing time properties
	 * const elapsed = new ElapsedTime(93784000);  // 26h 3m 4s
	 * // First access triggers calculation
	 * console.log(elapsed.Hours);     // 2 (26 % 24)
	 * console.log(elapsed.TotalHours); // 26
	 * ```
	 */
	private _CalculateTimeValues(): void {
		if (this._ValuesCalculated) return;

		this._TotalSeconds = Math.floor(this._TotalMilliseconds / MS_PER_SECOND);
		this._TotalMinutes = Math.floor(this._TotalSeconds / SECONDS_PER_MINUTE);
		this._TotalHours = Math.floor(this._TotalMinutes / MINUTES_PER_HOUR);
		this._TotalDays = Math.floor(this._TotalHours / HOURS_PER_DAY);
		this._Weeks = Math.floor(this._TotalDays / DAYS_PER_WEEK);

		this._Days = this._TotalDays % DAYS_PER_WEEK;
		this._Hours = this._TotalHours % HOURS_PER_DAY;
		this._Minutes = this._TotalMinutes % MINUTES_PER_HOUR;
		this._Seconds = this._TotalSeconds % SECONDS_PER_MINUTE;
		this._Milliseconds = this._TotalMilliseconds % MS_PER_SECOND;

		this._ValuesCalculated = true;
	}

	/**
	 * Gets the number of weeks in the elapsed time.
	 */
	public get Weeks(): number {
		this._CalculateTimeValues();
		return this._Weeks;
	}

	/**
	 * Gets the number of days in the elapsed time (excluding complete weeks).
	 */
	public get Days(): number {
		this._CalculateTimeValues();
		return this._Days;
	}

	/**
	 * Gets the total number of days in the elapsed time.
	 */
	public get TotalDays(): number {
		this._CalculateTimeValues();
		return this._TotalDays;
	}

	/**
	 * Gets the number of hours in the elapsed time (excluding complete days).
	 */
	public get Hours(): number {
		this._CalculateTimeValues();
		return this._Hours;
	}

	/**
	 * Gets the hours component as a padded string.
	 * @param length The minimum length to pad to (default: 2).
	 * @returns The zero-padded string.
	 */
	public HoursPadded(length: number = 2): string {
		return this.Hours.toString().padStart(length, '0');
	}

	/**
	 * Gets the total number of hours in the elapsed time.
	 */
	public get TotalHours(): number {
		this._CalculateTimeValues();
		return this._TotalHours;
	}

	/**
	 * Gets the total hours as a padded string.
	 * @param length The minimum length to pad to (default: 2).
	 * @returns The zero-padded string.
	 */
	public TotalHoursPadded(length: number = 2): string {
		return this.TotalHours.toString().padStart(length, '0');
	}

	/**
	 * Gets the number of minutes in the elapsed time (excluding complete hours).
	 */
	public get Minutes(): number {
		this._CalculateTimeValues();
		return this._Minutes;
	}

	/**
	 * Gets the minutes component as a padded string.
	 * @param length The minimum length to pad to (default: 2).
	 * @returns The zero-padded string.
	 */
	public MinutesPadded(length: number = 2): string {
		return this.Minutes.toString().padStart(length, '0');
	}

	/**
	 * Gets the total number of minutes in the elapsed time.
	 */
	public get TotalMinutes(): number {
		this._CalculateTimeValues();
		return this._TotalMinutes;
	}

	/**
	 * Gets the total minutes as a padded string.
	 * @param length The minimum length to pad to (default: 2).
	 * @returns The zero-padded string.
	 */
	public TotalMinutesPadded(length: number = 2): string {
		return this.TotalMinutes.toString().padStart(length, '0');
	}

	/**
	 * Gets the number of seconds in the elapsed time (excluding complete minutes).
	 */
	public get Seconds(): number {
		this._CalculateTimeValues();
		return this._Seconds;
	}

	/**
	 * Gets the seconds component as a padded string.
	 * @param length The minimum length to pad to (default: 2).
	 * @returns The zero-padded string.
	 */
	public SecondsPadded(length: number = 2): string {
		return this.Seconds.toString().padStart(length, '0');
	}

	/**
	 * Gets the total number of seconds in the elapsed time.
	 */
	public get TotalSeconds(): number {
		this._CalculateTimeValues();
		return this._TotalSeconds;
	}

	/**
	 * Gets the total seconds as a padded string.
	 * @param length The minimum length to pad to (default: 2).
	 * @returns The zero-padded string.
	 */
	public TotalSecondsPadded(length: number = 2): string {
		return this.TotalSeconds.toString().padStart(length, '0');
	}

	/**
	 * Gets the number of milliseconds in the elapsed time (excluding complete seconds).
	 */
	public get Milliseconds(): number {
		this._CalculateTimeValues();
		return this._Milliseconds;
	}

	/**
	 * Gets the milliseconds component as a padded string.
	 * @param length The minimum length to pad to (default: 3).
	 * @returns The zero-padded string.
	 */
	public MillisecondsPadded(length: number = PRECISION_DECIMAL_PLACES): string {
		return this.Milliseconds.toString().padStart(length, '0');
	}

	/**
	 * Checks if the elapsed time represents a negative duration.
	 */
	public get IsNegative(): boolean {
		return this._IsNegative;
	}

	/**
	 * Gets the total number of milliseconds in the elapsed time.
	 */
	public get TotalMilliseconds(): number {
		return this._TotalMilliseconds;
	}

	/**
	 * Sets the total number of milliseconds in the elapsed time.
	 */
	public set TotalMilliseconds(value: number) {
		this._IsNegative = value < 0;
		this._TotalMilliseconds = Math.abs(value);
		this._ValuesCalculated = false;
	}

	/**
	 * Get the total milliseconds as a padded string.
	 *
	 * @param length - The minimum length to pad to (default: 3)
	 * @returns The total milliseconds as a zero-padded string
	 *
	 * @example
	 * ```typescript
	 * const elapsed = new ElapsedTime(5750);
	 * console.log(elapsed.TotalMillisecondsPadded());   // "5750"
	 * console.log(elapsed.TotalMillisecondsPadded(6));  // "005750"
	 * ```
	 */
	public TotalMillisecondsPadded(length: number = PRECISION_DECIMAL_PLACES): string {
		return this.TotalMilliseconds.toString().padStart(length, '0');
	}

	/**
	 * Create a new ElapsedTime instance from start and stop timestamps.
	 * Convenience method for calculating elapsed time between two points in time.
	 *
	 * @param start - The start time in milliseconds (typically from Date.now() or performance.now())
	 * @param stop - The stop time in milliseconds
	 * @returns A new ElapsedTime instance representing the duration between start and stop
	 *
	 * @example
	 * ```typescript
	 * const start = Date.now();
	 * // ... some operation that takes time ...
	 * const end = Date.now();
	 * const duration = ElapsedTime.From(start, end);
	 * console.log(duration.Format('CONCISE')); // "1s 250ms"
	 * ```
	 *
	 * @example
	 * ```typescript
	 * // Using with performance.now() for high precision
	 * const start = performance.now();
	 * await someAsyncOperation();
	 * const end = performance.now();
	 * const duration = ElapsedTime.From(start, end);
	 * console.log(duration.Format('MEDIUM')); // "1 sec 250 ms"
	 * ```
	 */
	public static From(start: number, stop: number): ElapsedTime {
		return new ElapsedTime(stop - start);
	}

	/**
	 * Format a duration of time using static method convenience.
	 * Creates a temporary ElapsedTime instance and formats it in one operation.
	 *
	 * @param milliseconds - The total number of milliseconds to format
	 * @param format - The format string or predefined format name (default: 'CONCISE')
	 * @param options - Formatting options of type ITimeElapsedFormatOptions for customization
	 * @returns The formatted time string
	 *
	 * @example
	 * ```typescript
	 * // Quick formatting without creating an instance
	 * console.log(ElapsedTime.Format(3661000));           // "1h 1m 1s"
	 * console.log(ElapsedTime.Format(3661000, 'LONG'));   // "1 hour 1 minute 1 second"
	 *
	 * // With custom options
	 * const options = { maxUnits: 2, showZeroValues: false };
	 * console.log(ElapsedTime.Format(3661000, 'MEDIUM', options)); // "1 hour 1 min"
	 * ```
	 */
	public static Format(milliseconds: number, format: TTimeElapsedFormats = 'concise', options: Partial<ITimeElapsedFormatOptions> = {}): string {
		const elapsedTime = new ElapsedTime(milliseconds);
		return elapsedTime.Format(format, options);
	}

	/**
	 * Format the elapsed time according to the specified format and options.
	 * This is the primary formatting method that handles all predefined formats
	 * and custom formatting configurations.
	 *
	 * Available predefined formats:
	 * - **CONCISE**: "1h 30m 45s" - Ultra-compact with single-letter units
	 * - **SHORT**: "1hr 30min 45sec" - Abbreviated but readable units
	 * - **MEDIUM**: "1 hour 30 min 45 sec" - Balanced readability and length
	 * - **LONG**: "1 hour 30 minutes 45 seconds" - Full words with proper pluralization
	 * - **MOST_SIGNIFICANT**: Shows only the 2 most significant units
	 * - **TIME**: "1:30" - Clock-style hours:minutes format
	 * - **TIME_WITH_SECONDS**: "1:30:45" - Extended clock format with seconds
	 *
	 * @param format - The format string or predefined format name (default: 'CONCISE')
	 * @param options - Formatting options of type ITimeElapsedFormatOptions for fine-tuned control
	 * @returns The formatted time string
	 *
	 * @example
	 * ```typescript
	 * const elapsed = new ElapsedTime(5425000);  // 1h 30m 25s
	 *
	 * // Predefined formats
	 * elapsed.Format('CONCISE');         // "1h 30m 25s"
	 * elapsed.Format('SHORT');           // "1hr 30min 25sec"
	 * elapsed.Format('MEDIUM');          // "1 hour 30 min 25 sec"
	 * elapsed.Format('LONG');            // "1 hour 30 minutes 25 seconds"
	 * elapsed.Format('TIME');            // "1:30"
	 * elapsed.Format('TIME_WITH_SECONDS'); // "1:30:25"
	 * ```
	 *
	 * @example
	 * ```typescript
	 * // Custom formatting with options
	 * const elapsed = new ElapsedTime(-5425000);  // Negative duration
	 *
	 * const options = {
	 *   negativeValueFormat: 'Parenthesis',
	 *   maxUnits: 2,
	 *   showZeroValues: false
	 * };
	 *
	 * elapsed.Format('MEDIUM', options); // "(1 hour 30 min)"
	 * ```
	 *
	 * @example
	 * ```typescript
	 * // Custom labels
	 * const elapsed = new ElapsedTime(5425000);
	 *
	 * const customOptions = {
	 *   unitLabels: {
	 *     hour: 'hrs',
	 *     minute: 'mins',
	 *     second: 'secs'
	 *   }
	 * };
	 *
	 * elapsed.Format('CUSTOM', customOptions); // "1 hrs 30 mins 25 secs"
	 * ```
	 */
	public Format(format: TTimeElapsedFormats = 'concise', options: Partial<ITimeElapsedFormatOptions> = {}): string {
		// Ensure all time values are calculated
		this._CalculateTimeValues();

		let resolvedOptions = { ...options };

		// Handle predefined formats
		if (typeof format === 'string') {
			let normalizedFormat = format.toLowerCase().replace(/_/g, '');
			if (normalizedFormat === 'mostsignificant') normalizedFormat = 'mostSignificant';
			if (normalizedFormat === 'timewithseconds') normalizedFormat = 'timeWithSeconds';
			if (normalizedFormat in FORMATS) {
				resolvedOptions = { ...FORMATS[normalizedFormat as keyof typeof FORMATS], ...options };
			}
		}

		const appliedOptions = ApplyDefaultOptions(resolvedOptions);

		// Special case for LONG format which needs special handling
		if (typeof format === 'string' && format.toLowerCase() === 'long') {
			return this._FormatLong(appliedOptions);
		}

		return this._FormatUsingTokens(appliedOptions);
	}

	/**
	 * Special formatter for LONG format with proper pluralization.
	 * Handles the unique requirements of the LONG format which uses
	 * full English words with grammatically correct singular/plural forms.
	 *
	 * @param options - Formatting options with LONG-specific settings
	 * @returns Formatted string with proper pluralization (e.g., "1 hour 30 minutes")
	 * @private
	 *
	 * @example
	 * ```typescript
	 * // Internal usage - called automatically for LONG format
	 * const elapsed = new ElapsedTime(3661000);  // 1 hour, 1 minute, 1 second
	 * elapsed.Format('LONG'); // "1 hour 1 minute 1 second" (all singular)
	 *
	 * const elapsed2 = new ElapsedTime(7322000); // 2 hours, 2 minutes, 2 seconds
	 * elapsed2.Format('LONG'); // "2 hours 2 minutes 2 seconds" (all plural)
	 * ```
	 */
	private _FormatLong(options: ITimeElapsedFormatOptions): string {
		const parts: string[] = [];

		// Process each time unit in order of significance
		if (this._Weeks > 0 || options.showZeroValues) {
			parts.push(`${this._Weeks} ${this._Weeks === 1 ? 'week' : 'weeks'}`);
		}

		if (this._Days > 0 || options.showZeroValues) {
			parts.push(`${this._Days} ${this._Days === 1 ? 'day' : 'days'}`);
		}

		if (this._Hours > 0 || options.showZeroValues) {
			parts.push(`${this._Hours} ${this._Hours === 1 ? 'hour' : 'hours'}`);
		}

		if (this._Minutes > 0 || options.showZeroValues) {
			parts.push(`${this._Minutes} ${this._Minutes === 1 ? 'minute' : 'minutes'}`);
		}

		if (this._Seconds > 0 || options.showZeroValues) {
			parts.push(`${this._Seconds} ${this._Seconds === 1 ? 'second' : 'seconds'}`);
		}

		if (this._Milliseconds > 0 || options.showZeroValues) {
			parts.push(`${this._Milliseconds} ${this._Milliseconds === 1 ? 'millisecond' : 'milliseconds'}`);
		}

		// Handle case where no parts were added
		if (parts.length === 0) {
			parts.push('0 seconds');
		}

		// Apply maxUnits if specified
		if (options.maxUnits && parts.length > options.maxUnits) {
			parts.length = options.maxUnits;
		}

		const formatted = parts.join(' ');

		// Apply negative formatting
		if (this.IsNegative) {
			return ElapsedTime._ApplyNegativeFormatting(formatted, options);
		}

		return formatted;
	}

	/**
	 * Format the elapsed time using the token-based formatting system.
	 * This is the main formatting engine that handles all predefined formats
	 * except LONG (which has special pluralization requirements).
	 *
	 * The method:
	 * 1. Creates an array of time units with their values
	 * 2. Filters and limits units based on options
	 * 3. Determines formatting approach (TIME vs standard formats)
	 * 4. Applies appropriate formatting and returns the result
	 *
	 * @param options - Complete formatting options with defaults applied
	 * @returns Formatted time string according to the specified format
	 * @private
	 *
	 * @example
	 * ```typescript
	 * // Internal usage - handles formats like CONCISE, SHORT, MEDIUM, TIME, etc.
	 * // Called automatically by Format() method for most format types
	 * ```
	 */
	private _FormatUsingTokens(options: ITimeElapsedFormatOptions): string {
		// Define all available time units
		const units: ITimeUnitValue[] = [
			{ unit: 'week', value: this.Weeks },
			{ unit: 'day', value: this.Days },
			{ unit: 'hour', value: this.Hours },
			{ unit: 'minute', value: this.Minutes },
			{ unit: 'second', value: this.Seconds },
			{ unit: 'millisecond', value: this.Milliseconds },
		];

		// Filter and limit units based on options
		const filteredUnits = ElapsedTime._FilterAndLimitUnits(units, options);
		const unitLabels = options.unitLabels ?? DEFAULT_UNIT_LABELS.medium;

		// Determine the formatting approach based on unit labels
		let formatted: string;

		// Check for time formats with colons (TIME, TIME_WITH_SECONDS)
		const isTimeFormat = ElapsedTime._ValidateTimeFormat(unitLabels);
		if (isTimeFormat) {
			formatted = ElapsedTime._FormatTimeUnits(filteredUnits, unitLabels);
		} else {
			// Handle different format types
			formatted = ElapsedTime._FormatStandardUnits(filteredUnits, unitLabels);
		}

		return this.IsNegative ? ElapsedTime._ApplyNegativeFormatting(formatted, options) : formatted;
	}

	/**
	 * Format time units for TIME and TIME_WITH_SECONDS formats
	 * These formats use special formatting with colons for displaying time (e.g., "1:30:45")
	 * @param units - Array of time units with their values
	 * @param unitLabels - Object containing label definitions for each time unit
	 * @returns Formatted time string with colons (e.g., "1:30:45")
	 * @private
	 */
	private static _FormatTimeUnits(units: ITimeUnitValue[], unitLabels: NonNullable<ITimeElapsedFormatOptions['unitLabels']>): string {
		return units.map(({ unit, value: _value }) => {
			const labelFunc = unitLabels[unit];
			if (!labelFunc) return '';
			return typeof labelFunc === 'function' ? (labelFunc as (_value: number) => string)(_value) : '';
		}).join('');
	}

	/**
	 * Format units for standard (non-time) formats
	 * Handles different formatting styles including CONCISE, SHORT, MEDIUM, LONG, and custom formats
	 * @param units - Array of time units with their values
	 * @param unitLabels - Object containing label definitions for each time unit
	 * @returns Formatted time string according to the specified format style
	 * @private
	 */
	private static _FormatStandardUnits(units: ITimeUnitValue[], unitLabels: NonNullable<ITimeElapsedFormatOptions['unitLabels']>): string {
		// Handle LONG format with pluralization
		if (Object.values(unitLabels).some((label) => typeof label === 'function')) {
			return units.map(({ unit, value }) => {
				const labelFunc = unitLabels[unit];
				if (!labelFunc) return '';

				const label = typeof labelFunc === 'function' ? labelFunc(value) : labelFunc;
				return `${value} ${label}`;
			}).join(' ');
		}

		// For CONCISE and SHORT formats (e.g., "1h 30m" or "1hr 30min")
		if (unitLabels === DEFAULT_UNIT_LABELS.concise || unitLabels === DEFAULT_UNIT_LABELS.short) {
			return units.map(({ unit, value }) => `${value}${unitLabels[unit]}`).join(' ');
		}

		// For MEDIUM format (e.g., "1 hour 30 min")
		if (unitLabels === DEFAULT_UNIT_LABELS.medium) {
			return units.map(({ unit, value }) => `${value} ${unitLabels[unit]}`).join(' ');
		}

		// Custom labels (including those with commas)
		return units.map(({ unit, value }) => {
			const label = unitLabels[unit];
			if (typeof label === 'undefined') return '';

			// For labels with built-in spaces or punctuation at the start
			if (typeof label === 'string' && (label.startsWith(' ') || label.startsWith(','))) {
				return `${value}${label}`;
			}

			// Handle special case for custom labels with commas - used in tests
			if (typeof label === 'string' && label.trim().endsWith(',')) {
				return `${value} ${label}`;
			}

			return `${value} ${label}`;
		}).join('').trim(); // Join without spaces and trim any trailing spaces
	}

	/**
	 * Determine if the unit labels represent a time format with colons.
	 * Analyzes the unit label configuration to detect TIME and TIME_WITH_SECONDS
	 * formats which require special colon-separated formatting.
	 *
	 * @param unitLabels - The unit labels to analyze
	 * @returns True if this is a colon-based time format, false for standard formats
	 * @private
	 *
	 * @example
	 * ```typescript
	 * // Internal usage - distinguishes between:
	 * // TIME format: "1:30" (colon-separated)
	 * // CONCISE format: "1h 30m" (space-separated with labels)
	 * ```
	 */
	private static _ValidateTimeFormat(unitLabels: NonNullable<ITimeElapsedFormatOptions['unitLabels']>): boolean {
		return Boolean(unitLabels.hour && typeof unitLabels.hour === 'function' && unitLabels.minute && typeof unitLabels.minute === 'function' && (
			String(unitLabels.hour).includes(':') || String(unitLabels.minute).includes('padStart')
		));
	}

	/**
	 * Filter and limit time units based on formatting options.
	 * Applies showZeroValues and maxUnits options to determine which
	 * time components should be included in the final formatted output.
	 *
	 * @param units - All available time units with their calculated values
	 * @param options - Formatting options containing filtering rules
	 * @returns Filtered and limited array of time units for formatting
	 * @private
	 *
	 * @example
	 * ```typescript
	 * // Internal usage - handles cases like:
	 * // showZeroValues: false -> filters out units with value 0
	 * // maxUnits: 2 -> keeps only the first 2 significant units
	 * // All zero values -> ensures at least "0 seconds" is shown
	 * ```
	 */
	private static _FilterAndLimitUnits(units: ITimeUnitValue[], options: ITimeElapsedFormatOptions): ITimeUnitValue[] {
		// Filter out zero values if not showing them
		let filteredUnits = options.showZeroValues ? units : units.filter((item) => item.value > 0);

		// Handle the case where all values are zero
		if (filteredUnits.length === 0) {
			// Show at least seconds as zero
			filteredUnits = [{ unit: 'second', value: 0 }];
		}

		// Limit the number of units if specified
		if (typeof options.maxUnits !== 'undefined' && filteredUnits.length > options.maxUnits) {
			filteredUnits.length = options.maxUnits;
		}

		return filteredUnits;
	}

	/**
	 * Apply negative value formatting based on user preferences.
	 * Wraps or modifies the formatted time string to indicate negative durations
	 * according to the specified negativeValueFormat option.
	 *
	 * @param output - The pre-formatted time string (positive representation)
	 * @param options - Formatting options containing negative value format preference
	 * @returns The formatted string with negative formatting applied if needed
	 * @private
	 *
	 * @example
	 * ```typescript
	 * // Internal usage - transforms positive format to negative representation:
	 * // NegativeSign: "1h 30m" -> "-1h 30m"
	 * // Parenthesis: "1h 30m" -> "(1h 30m)"
	 * // Brackets: "1h 30m" -> "[1h 30m]"
	 * // Empty: "1h 30m" -> "1h 30m" (no change)
	 * ```
	 */
	private static _ApplyNegativeFormatting(output: string, options: ITimeElapsedFormatOptions): string {
		switch (options.negativeValueFormat) {
			case 'NegativeSign':
				return `-${output}`;
			case 'Parenthesis':
				return `(${output})`;
			case 'Brackets':
				return `[${output}]`;
			case 'Empty':
			default:
				return output;
		}
	}
}

/**
 * Formats elapsed time using the specified configuration.
 * This is a simplified formatting function that uses IFormatConfig for basic formatting options.
 *
 * @param milliseconds - The total number of milliseconds to format
 * @param options - Formatting configuration options
 * @returns The formatted time string
 *
 * @example
 * ```typescript
 * import { FormatElapsedTime } from './elapsed-time';
 *
 * console.log(FormatElapsedTime(3661000)); // "1h 1m 1s"
 * console.log(FormatElapsedTime(3661000, { maxUnits: 1 })); // "1h"
 * ```
 */
export function FormatElapsedTime(milliseconds: number, options?: IFormatConfig): string {
	const elapsedTime = new ElapsedTime(milliseconds);
	return elapsedTime.Format('concise', {
		maxUnits: options?.maxUnits,
		unitLabels: options?.unitLabels,
	});
}
