import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ElapsedTime, FormatElapsedTime } from './elapsed-time/elapsed-time.js';
import { DEFAULT_UNIT_LABELS } from './elapsed-time/constants.js';
import { Stopwatch } from './stopwatch/stopwatch.js';
import { StopwatchEntry } from './stopwatch/entry.js';

// ----- ElapsedTime -----

describe('ElapsedTime', () => {
	describe('constructor and basic properties', () => {
		it('stores positive milliseconds', () => {
			const et = new ElapsedTime(5000);
			expect(et.TotalMilliseconds).toBe(5000);
			expect(et.IsNegative).toBe(false);
		});

		it('stores the absolute value and sets negative flag', () => {
			const et = new ElapsedTime(-5000);
			expect(et.TotalMilliseconds).toBe(5000);
			expect(et.IsNegative).toBe(true);
		});

		it('handles zero milliseconds', () => {
			const et = new ElapsedTime(0);
			expect(et.TotalMilliseconds).toBe(0);
			expect(et.IsNegative).toBe(false);
		});
	});

	describe('From()', () => {
		it('computes elapsed time between start and stop', () => {
			const et = ElapsedTime.From(1000, 3500);
			expect(et.TotalMilliseconds).toBe(2500);
		});

		it('produces a negative elapsed time when stop < start', () => {
			const et = ElapsedTime.From(5000, 3000);
			expect(et.IsNegative).toBe(true);
		});
	});

	describe('Format()', () => {
		it('formats CONCISE correctly', () => {
			const et = new ElapsedTime(3661000); // 1h 1m 1s
			const result = et.Format('concise');
			expect(result).toContain('h');
			expect(result).toContain('m');
		});

		it('formats LONG correctly with pluralization', () => {
			const et = new ElapsedTime(7322000); // 2h 2m 2s
			const result = et.Format('long');
			expect(result).toContain('hours');
			expect(result).toContain('minutes');
			expect(result).toContain('seconds');
		});

		it('formats LONG singly for 1 unit', () => {
			const et = new ElapsedTime(3661000); // 1h 1m 1s
			const result = et.Format('long');
			expect(result).toContain('hour');
			expect(result).toContain('minute');
			expect(result).toContain('second');
		});

		it('formats TIME as hh:mm', () => {
			const et = new ElapsedTime(3661000); // 1h 1m 1s
			const result = et.Format('time');
			expect(result).toMatch(/\d+:\d+/);
		});

		it('formats TIME_WITH_SECONDS as hh:mm:ss', () => {
			const et = new ElapsedTime(3661000);
			const result = et.Format('timeWithSeconds');
			expect(result).toMatch(/\d+:\d+:\d+/);
		});

		it('produces "0 seconds" for zero duration in LONG format', () => {
			const et = new ElapsedTime(0);
			expect(et.Format('long')).toBe('0 seconds');
		});

		it('supports maxUnits option', () => {
			const et = new ElapsedTime(3661500); // 1h 1m 1s 500ms
			const result = et.Format('long', { maxUnits: 2 });
			// Should only show 2 units
			const parts = result.split(' ').filter((p) => /^(hour|minute|second|millisecond|day|week)/.test(p));
			expect(parts.length).toBeLessThanOrEqual(2);
		});
	});

	describe('static Format()', () => {
		it('formats milliseconds directly', () => {
			const result = ElapsedTime.Format(3600000); // 1h
			expect(result).toContain('h');
		});
	});
});

// ----- Stopwatch -----

describe('Stopwatch', () => {
	let now: number;

	beforeEach(() => {
		now = 1000;
		vi.spyOn(Date, 'now').mockImplementation(() => now);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('initial state', () => {
		it('is not running when created without startImmediately', () => {
			const sw = new Stopwatch();
			expect(sw.Running).toBe(false);
		});

		it('starts running when created with startImmediately=true', () => {
			const sw = new Stopwatch(true);
			expect(sw.Running).toBe(true);
		});

		it('has undefined First and Latest', () => {
			const sw = new Stopwatch();
			expect(sw.First).toBeUndefined();
			expect(sw.Latest).toBeUndefined();
		});

		it('returns zero elapsed time before start', () => {
			const sw = new Stopwatch();
			expect(sw.Elapsed.TotalMilliseconds).toBe(0);
		});
	});

	describe('Start()', () => {
		it('starts the stopwatch', () => {
			const sw = new Stopwatch();
			sw.Start();
			expect(sw.Running).toBe(true);
		});

		it('returns the first entry', () => {
			const sw = new Stopwatch();
			const entry = sw.Start();
			expect(entry).toBeDefined();
		});

		it('does not start again if already started', () => {
			const sw = new Stopwatch();
			const e1 = sw.Start();
			const e2 = sw.Start();
			expect(e1).toBe(e2);
		});
	});

	describe('Stop()', () => {
		it('stops a running stopwatch', () => {
			const sw = new Stopwatch();
			sw.Start();
			now = 2000;
			sw.Stop();
			expect(sw.Running).toBe(false);
		});

		it('returns undefined when not started', () => {
			const sw = new Stopwatch();
			expect(sw.Stop()).toBeUndefined();
		});

		it('records the correct elapsed time', () => {
			const sw = new Stopwatch();
			sw.Start();
			now = 3000;
			sw.Stop();
			expect(sw.Elapsed.TotalMilliseconds).toBe(2000);
		});
	});

	describe('Pause() and Resume()', () => {
		it('pauses a running stopwatch', () => {
			const sw = new Stopwatch(true);
			sw.Pause();
			expect(sw.Running).toBe(false);
			expect(sw.PausedAt).not.toBeNull();
		});

		it('resumes a paused stopwatch', () => {
			const sw = new Stopwatch(true);
			sw.Pause();
			sw.Resume();
			expect(sw.Running).toBe(true);
			expect(sw.PausedAt).toBeNull();
		});

		it('returns null when Resume is called without Pause', () => {
			const sw = new Stopwatch(true);
			expect(sw.Resume()).toBeNull();
		});

		it('returns null when Pause is called on a not-started stopwatch', () => {
			const sw = new Stopwatch();
			expect(sw.Pause()).toBeNull();
		});
	});

	describe('Lap()', () => {
		it('returns elapsed time since last lap/click', () => {
			const sw = new Stopwatch(true);
			now = 1500;
			const lap = sw.Lap();
			expect(lap.TotalMilliseconds).toBe(500);
		});

		it('returns zero for first lap with no previous entry', () => {
			const sw = new Stopwatch();
			const lap = sw.Lap();
			expect(lap.TotalMilliseconds).toBe(0);
		});
	});

	describe('Reset()', () => {
		it('resets times and running state', () => {
			const sw = new Stopwatch(true);
			sw.Stop();
			sw.Reset();
			expect(sw.Running).toBe(false);
			expect(sw.Times).toHaveLength(0);
		});
	});

	describe('Elapsed', () => {
		it('is calculated relative to the first entry', () => {
			const sw = new Stopwatch(true);
			now = 5000;
			expect(sw.Elapsed.TotalMilliseconds).toBe(4000);
		});

		it('is frozen at stop time after Stop()', () => {
			const sw = new Stopwatch(true);
			now = 3000;
			sw.Stop();
			// Advance time further - elapsed should not change
			now = 9000;
			expect(sw.Elapsed.TotalMilliseconds).toBe(2000);
		});
	});
});

// ----- StopwatchEntry -----

describe('StopwatchEntry', () => {
	let now: number;

	beforeEach(() => {
		now = 1000;
		vi.spyOn(Date, 'now').mockImplementation(() => now);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('exposes the correct timestamp', () => {
		const sw = new Stopwatch(true);
		const entry = sw.First!;
		expect(entry.timestamp).toBe(1000);
	});

	it('Elapsed returns 0 for the first entry (no predecessor)', () => {
		const sw = new Stopwatch(true);
		expect(sw.First!.Elapsed.TotalMilliseconds).toBe(0);
	});

	it('Elapsed returns the interval since the previous entry', () => {
		const sw = new Stopwatch(true); // entry 0 at t=1000
		now = 1500;
		sw.Lap(); // entry 1 at t=1500
		// Latest is entry 1; predecessor is entry 0 → 1500 - 1000 = 500
		expect(sw.Latest!.Elapsed.TotalMilliseconds).toBe(500);
	});

	it('ElapsedTotal returns 0 for a standalone entry with no stopwatch', () => {
		const standalone = new StopwatchEntry(9999);
		expect(standalone.ElapsedTotal.TotalMilliseconds).toBe(0);
	});

	it('ElapsedTotal returns 0 when stopwatch has no recorded entries', () => {
		const sw = new Stopwatch();
		// Manually construct an entry that references an empty-ish stopwatch
		// (can't happen through the normal API, but StopwatchEntry is public)
		const entry = new StopwatchEntry(2000, sw, 0);
		expect(entry.ElapsedTotal.TotalMilliseconds).toBe(0);
	});

	it('ElapsedTotal returns total time from first entry to this entry', () => {
		const sw = new Stopwatch(true); // entry 0 at t=1000
		now = 2000;
		sw.Lap(); // entry 1 at t=2000
		now = 3500;
		sw.Stop(); // entry 2 at t=3500
		// Latest (Stop entry) ElapsedTotal = 3500 - 1000 = 2500
		expect(sw.Latest!.ElapsedTotal.TotalMilliseconds).toBe(2500);
	});

	it('Elapsed returns 0 for a standalone entry with no stopwatch', () => {
		const standalone = new StopwatchEntry(5000);
		expect(standalone.Elapsed.TotalMilliseconds).toBe(0);
	});
});

// ----- ElapsedTime: padded helpers and negative formatting -----

describe('ElapsedTime (extended)', () => {
	it('HoursPadded returns zero-padded hours string', () => {
		const et = new ElapsedTime(3661000); // 1h 1m 1s
		expect(et.HoursPadded()).toBe('01');
		expect(et.HoursPadded(3)).toBe('001');
	});

	it('MinutesPadded returns zero-padded minutes string', () => {
		const et = new ElapsedTime(3661000);
		expect(et.MinutesPadded()).toBe('01');
	});

	it('SecondsPadded returns zero-padded seconds string', () => {
		const et = new ElapsedTime(3661000);
		expect(et.SecondsPadded()).toBe('01');
	});

	it('MillisecondsPadded returns zero-padded milliseconds string', () => {
		const et = new ElapsedTime(3661500); // …500ms
		expect(et.MillisecondsPadded()).toBe('500');
	});

	it('TotalHoursPadded returns total hours zero-padded', () => {
		const et = new ElapsedTime(90000000); // 25 hours
		expect(et.TotalHoursPadded()).toBe('25');
	});

	it('TotalMinutesPadded returns total minutes zero-padded', () => {
		const et = new ElapsedTime(600000); // 10 minutes
		expect(et.TotalMinutesPadded()).toBe('10');
	});

	it('TotalSecondsPadded returns total seconds zero-padded', () => {
		const et = new ElapsedTime(65000); // 65 seconds
		expect(et.TotalSecondsPadded()).toBe('65');
	});

	it('TotalMillisecondsPadded pads shorter values', () => {
		const et = new ElapsedTime(5);
		expect(et.TotalMillisecondsPadded(6)).toBe('000005');
	});

	it('TotalMilliseconds setter resets cached values', () => {
		const et = new ElapsedTime(1000);
		expect(et.Seconds).toBe(1);
		et.TotalMilliseconds = 2000;
		expect(et.TotalMilliseconds).toBe(2000);
		expect(et.Seconds).toBe(2);
	});

	it('TotalMilliseconds setter handles negative values', () => {
		const et = new ElapsedTime(1000);
		et.TotalMilliseconds = -3000;
		expect(et.IsNegative).toBe(true);
		expect(et.TotalMilliseconds).toBe(3000);
	});

	it('Format with negativeValueFormat NegativeSign prepends minus', () => {
		const et = new ElapsedTime(-5000);
		const result = et.Format('concise', { negativeValueFormat: 'NegativeSign' });
		expect(result.startsWith('-')).toBe(true);
	});

	it('Format with negativeValueFormat Parenthesis wraps in parentheses', () => {
		const et = new ElapsedTime(-5000);
		const result = et.Format('concise', { negativeValueFormat: 'Parenthesis' });
		expect(result.startsWith('(')).toBe(true);
		expect(result.endsWith(')')).toBe(true);
	});

	it('Format with negativeValueFormat Brackets wraps in brackets', () => {
		const et = new ElapsedTime(-5000);
		const result = et.Format('concise', { negativeValueFormat: 'Brackets' });
		expect(result.startsWith('[')).toBe(true);
		expect(result.endsWith(']')).toBe(true);
	});

	it('Format showZeroValues includes all units', () => {
		const et = new ElapsedTime(1000); // 1 second, 0 ms
		const result = et.Format('concise', { showZeroValues: true });
		expect(result).toContain('0ms');
	});

	it('Weeks and Days properties decompose correctly', () => {
		const et = new ElapsedTime(9 * 24 * 3600 * 1000); // 9 days = 1 week + 2 days
		expect(et.Weeks).toBe(1);
		expect(et.Days).toBe(2);
		expect(et.TotalDays).toBe(9);
	});

	it('Format LONG includes negative long formatting', () => {
		const et = new ElapsedTime(-3662000); // ~1h 1m 2s
		const result = et.Format('long', { negativeValueFormat: 'NegativeSign' });
		expect(result.startsWith('-')).toBe(true);
		expect(result).toContain('hour');
	});

	it('Format short style produces abbreviated units', () => {
		const et = new ElapsedTime(3665000); // 1h 1m 5s
		const result = et.Format('short');
		expect(result).toContain('hr');
		expect(result).toContain('min');
	});

	it('Format medium style includes space-separated units', () => {
		const et = new ElapsedTime(3665000);
		const result = et.Format('medium');
		expect(result).toContain('hour');
		expect(result).toContain('min');
	});

	it('Format mostSignificant limits to 2 units', () => {
		const et = new ElapsedTime(3665500); // 1h 1m 5s 500ms
		const result = et.Format('mostSignificant');
		const parts = result.split(' ');
		// Each unit takes up 2 tokens ("1 hour", "1 min") → 4 tokens max
		expect(parts.length).toBeLessThanOrEqual(4);
	});
});

// ----- FormatElapsedTime standalone -----

describe('FormatElapsedTime', () => {
	it('formats milliseconds in concise style', () => {
		const result = FormatElapsedTime(3661000); // 1h 1m 1s
		expect(result).toContain('h');
		expect(result).toContain('m');
	});

	it('respects maxUnits option', () => {
		const result = FormatElapsedTime(3661000, { maxUnits: 1 });
		// concise format + maxUnits:1 → only the most significant unit, e.g. "1h"
		expect(result).toMatch(/^\d+h$/);
	});

	it('accepts custom unitLabels', () => {
		const result = FormatElapsedTime(3600000, { unitLabels: { hour: 'hr', minute: 'min', second: 'sec', millisecond: 'ms', day: 'd', week: 'wk' } });
		expect(result).toContain('hr');
	});

	it('separates multiple units with spaces when using custom string labels', () => {
		// 3661000 ms = 1h 1m 1s — exercises the multi-unit custom-label path
		const labels = { hour: 'hr', minute: 'min', second: 'sec', millisecond: 'ms', day: 'd', week: 'wk' };
		const et = new ElapsedTime(3661000);
		const result = et.Format('concise', { unitLabels: labels });
		// Units must be separated by spaces, not merged together
		expect(result).toMatch(/1 hr 1 min 1 sec/);
	});
});

// ----- DEFAULT_UNIT_LABELS.long lambda coverage -----

describe('DEFAULT_UNIT_LABELS.long', () => {
	it('produces singular labels for value 1', () => {
		// Pass DEFAULT_UNIT_LABELS.long as custom unitLabels to a non-long format
		// so _FormatUsingTokens calls the lambda functions.
		const et = new ElapsedTime(7 * 24 * 3600 * 1000 + 24 * 3600 * 1000 + 3600 * 1000 + 60 * 1000 + 1000); // 1w 1d 1h 1m 1s
		const result = et.Format('concise', { unitLabels: DEFAULT_UNIT_LABELS.long });
		expect(result).toContain('week');
		expect(result).toContain('day');
		expect(result).toContain('hour');
		expect(result).toContain('minute');
		expect(result).toContain('second');
	});

	it('produces plural labels for values > 1', () => {
		const et = new ElapsedTime(2 * 7 * 24 * 3600 * 1000 + 2 * 24 * 3600 * 1000 + 2 * 3600 * 1000 + 2 * 60 * 1000 + 2 * 1000 + 2);
		const result = et.Format('concise', { unitLabels: DEFAULT_UNIT_LABELS.long });
		expect(result).toContain('weeks');
		expect(result).toContain('days');
		expect(result).toContain('hours');
		expect(result).toContain('minutes');
		expect(result).toContain('seconds');
		expect(result).toContain('milliseconds');
	});
});
