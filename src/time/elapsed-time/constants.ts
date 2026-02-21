import type { IDefaultUnitLabels, IFormats } from './types';

/**
 * Default unit labels for different formatting styles.
 */
export const DEFAULT_UNIT_LABELS: IDefaultUnitLabels = {
	concise: {
		day: 'd',
		hour: 'h',
		millisecond: 'ms',
		minute: 'm',
		second: 's',
		week: 'w',
	},
	long: {
		 
		day: (value: number) => `${value === 1 ? 'day' : 'days'}`,
		 
		hour: (value: number) => `${value === 1 ? 'hour' : 'hours'}`,
		 
		millisecond: (value: number) => `${value === 1 ? 'millisecond' : 'milliseconds'}`,
		 
		minute: (value: number) => `${value === 1 ? 'minute' : 'minutes'}`,
		 
		second: (value: number) => `${value === 1 ? 'second' : 'seconds'}`,
		 
		week: (value: number) => `${value === 1 ? 'week' : 'weeks'}`,
	},
	medium: {
		day: 'day',
		hour: 'hour',
		millisecond: 'ms',
		minute: 'min',
		second: 'sec',
		week: 'week',
	},
	short: {
		day: 'd',
		hour: 'hr',
		millisecond: 'ms',
		minute: 'min',
		second: 'sec',
		week: 'wk',
	},
} as const;

/**
 * Predefined formatter styles with comprehensive formatting options.
 */
export const FORMATS: IFormats = {
	/**
	 * Format like "1h 30m 45s"
	 */
	concise: {
		unitLabels: DEFAULT_UNIT_LABELS.concise,
	},

	/**
	 * Format like "1 hour 30 minutes 45 seconds" with proper pluralization
	 */
	long: {
		unitLabels: DEFAULT_UNIT_LABELS.long,
	},

	/**
	 * Format like "1 hour 30 min 45 sec"
	 */
	medium: {
		unitLabels: DEFAULT_UNIT_LABELS.medium,
	},

	/**
	 * Format showing only the most significant 2 units
	 */
	mostSignificant: {
		maxUnits: 2,
		unitLabels: DEFAULT_UNIT_LABELS.medium,
	},

	/**
	 * Format like "1hr 30min 45sec"
	 */
	short: {
		unitLabels: DEFAULT_UNIT_LABELS.short,
	},

	/**
	 * Format showing only hours and minutes like "1:30"
	 */
	time: {
		maxUnits: 2,
		unitLabels: {
			 
			hour: (value: number) => `${value}:`,
			 
			minute: (value: number) => `${value.toString().padStart(2, '0')}`,
			 
			second: (value: number) => `:${value.toString().padStart(2, '0')}`,
		},
	},

	/**
	 * Format showing hours, minutes and seconds like "1:30:45"
	 */
	timeWithSeconds: {
		maxUnits: 3,
		unitLabels: {
			 
			hour: (value: number) => `${value}:`,
			 
			minute: (value: number) => `${value.toString().padStart(2, '0')}:`,
			 
			second: (value: number) => `${value.toString().padStart(2, '0')}`,
		},
	},
} as const;
