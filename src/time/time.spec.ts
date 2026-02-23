import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ElapsedTime } from './elapsed-time/elapsed-time.js';
import { Stopwatch } from './stopwatch/stopwatch.js';

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
