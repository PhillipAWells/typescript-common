/**
 * Represents a time unit and its corresponding value.
 */
export interface ITimeUnitValue {
	/** The time unit type (week, day, hour, minute, second, millisecond) */
	unit: TTimeUnit,
	/** The numeric value for this time unit */
	value: number
}

/**
 * Configuration options for formatting elapsed time values.
 */
export interface ITimeElapsedFormatOptions {
	/** How to format negative values: 'Empty' (no indicator), 'NegativeSign' (prefix with -), 'Parenthesis' (wrap in parentheses), or 'Brackets' (wrap in brackets) */
	negativeValueFormat?: 'Empty' | 'NegativeSign' | 'Parenthesis' | 'Brackets' | undefined;
	/** Show zero value units in formatter output (default: false) */
	showZeroValues?: boolean | undefined;
	/** Maximum number of units to include in formatter output (default: unlimited) */
	maxUnits?: number | undefined;
	/** Custom unit labels for formatter */
	unitLabels?: {
		week?: string | ((_value: number) => string) | undefined;
		day?: string | ((_value: number) => string) | undefined;
		hour?: string | ((_value: number) => string) | undefined;
		minute?: string | ((_value: number) => string) | undefined;
		second?: string | ((_value: number) => string) | undefined;
		millisecond?: string | ((_value: number) => string) | undefined;
	} | undefined;
}

/**
 * Predefined time elapsed format styles.
 */
export type TTimeElapsedFormats = 'concise' | 'short' | 'medium' | 'long' | 'mostSignificant' | 'time' | 'timeWithSeconds';

/**
 * Available time unit types for formatting elapsed time values.
 */
export type TTimeUnit = 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

/**
 * Unit label as a string
 */
export type TUnitLabelString = string;

/**
 * Unit label as a function that handles pluralization
 * @param value - The numeric value to determine singular/plural
 * @returns The appropriate label string
 */
export type TUnitLabelFunction = (value: number) => string;

/**
 * Unit label can be either a string or a function
 */
export type TUnitLabel = TUnitLabelString | TUnitLabelFunction;

/**
 * Map of time units to their labels
 */
export interface IUnitLabelMap {
	/** Label for milliseconds */
	millisecond: TUnitLabel;
	/** Label for seconds */
	second: TUnitLabel;
	/** Label for minutes */
	minute: TUnitLabel;
	/** Label for hours */
	hour: TUnitLabel;
	/** Label for days */
	day: TUnitLabel;
	/** Label for weeks */
	week: TUnitLabel;
}

/**
 * Concise format style with single-character labels
 */
export interface IConciseUnitLabels extends IUnitLabelMap {
	millisecond: 'ms';
	second: 's';
	minute: 'm';
	hour: 'h';
	day: 'd';
	week: 'w';
}

/**
 * Long format style with full words and pluralization
 */
export interface ILongUnitLabels extends IUnitLabelMap {
	millisecond: TUnitLabelFunction;
	second: TUnitLabelFunction;
	minute: TUnitLabelFunction;
	hour: TUnitLabelFunction;
	day: TUnitLabelFunction;
	week: TUnitLabelFunction;
}

/**
 * Medium format style with abbreviated words
 */
export interface IMediumUnitLabels extends IUnitLabelMap {
	millisecond: 'ms';
	second: 'sec';
	minute: 'min';
	hour: 'hour';
	day: 'day';
	week: 'week';
}

/**
 * Short format style with short abbreviations
 */
export interface IShortUnitLabels extends IUnitLabelMap {
	millisecond: 'ms';
	second: 'sec';
	minute: 'min';
	hour: 'hr';
	day: 'd';
	week: 'wk';
}

/**
 * Complete set of default unit labels for all formatting styles
 */
export interface IDefaultUnitLabels {
	concise: IConciseUnitLabels;
	long: ILongUnitLabels;
	medium: IMediumUnitLabels;
	short: IShortUnitLabels;
}

/**
 * Configuration options for elapsed time formatting
 */
export interface IFormatConfig {
	/** Maximum number of units to display */
	maxUnits?: number;
	/** Unit labels to use for formatting */
	unitLabels: Partial<IUnitLabelMap>;
}

/**
 * Predefined formatter styles
 */
export interface IFormats {
	/** Format like "1h 30m 45s" */
	concise: IFormatConfig;
	/** Format like "1 hour 30 minutes 45 seconds" with proper pluralization */
	long: IFormatConfig;
	/** Format like "1 hour 30 min 45 sec" */
	medium: IFormatConfig;
	/** Format showing only the most significant 2 units */
	mostSignificant: IFormatConfig;
	/** Format like "1hr 30min 45sec" */
	short: IFormatConfig;
	/** Format showing only hours and minutes like "1:30" */
	time: IFormatConfig;
	/** Format showing hours, minutes and seconds like "1:30:45" */
	timeWithSeconds: IFormatConfig;
}
