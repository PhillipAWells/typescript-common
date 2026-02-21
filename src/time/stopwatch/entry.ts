import { ElapsedTime } from '../elapsed-time/elapsed-time.js';
import { Stopwatch } from './stopwatch.js';

/**
 * Represents a single timestamped entry recorded by a {@link Stopwatch}.
 *
 * Each entry captures the exact moment in time (milliseconds since epoch) at
 * which a stopwatch event occurred — such as a start, stop, pause, resume, or
 * lap click. It exposes both the interval elapsed since the previous entry and
 * the total elapsed time since the stopwatch was first started.
 *
 * @example
 * ```typescript
 * const sw = new Stopwatch(true);
 * // ... some work ...
 * const entry = sw.Stop();
 * console.log(entry?.timestamp);              // e.g. 1708512000000
 * console.log(entry?.Elapsed.Format());       // e.g. "250ms"
 * console.log(entry?.ElapsedTotal.Format());  // e.g. "1s 250ms"
 * ```
 */
export class StopwatchEntry {
	private readonly _stopwatch: Stopwatch | null = null;

	private readonly _index: number = -1;

	/**
	 * Creates a new stopwatch entry.
	 *
	 * @param _timestamp - The Unix timestamp in milliseconds when this entry was recorded.
	 * @param stopwatch - The parent {@link Stopwatch} instance, used to compute
	 *   relative elapsed times. If omitted the entry is standalone, and `Elapsed`
	 *   and `ElapsedTotal` will always return zero.
	 * @param index - Zero-based position of this entry within the stopwatch's
	 *   internal times array. Used to locate the preceding entry for lap calculations.
	 */
	constructor(private readonly _timestamp: number, stopwatch?: Stopwatch, index?: number) {
		if (stopwatch) {
			this._stopwatch = stopwatch;
			this._index = index ?? 0;
		}
	}

	/**
	 * The Unix timestamp (milliseconds since epoch) when this entry was recorded.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * const entry = sw.Stop()!;
	 * console.log(new Date(entry.timestamp).toISOString());
	 * ```
	 */
	public get timestamp(): number {
		return this._timestamp;
	}

	/**
	 * The elapsed time between this entry and the immediately preceding entry.
	 *
	 * Returns {@link ElapsedTime} with a value of `0` if:
	 * - This is the first entry in the stopwatch (no previous entry exists), or
	 * - The entry was created without an associated stopwatch.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * // ... 300 ms of work ...
	 * const lap1 = sw.Lap();
	 * console.log(lap1.Format()); // "300ms"
	 * ```
	 */
	public get Elapsed(): ElapsedTime {
		if (!this._stopwatch || this._index <= 0) {
			return new ElapsedTime(0);
		}
		const previousEntry = this._stopwatch.Times[this._index - 1];
		if (!previousEntry) {
			return new ElapsedTime(0);
		}

		return new ElapsedTime(this._timestamp - previousEntry.timestamp);
	}

	/**
	 * The total elapsed time from the very first entry of the parent stopwatch
	 * up to and including this entry.
	 *
	 * Returns {@link ElapsedTime} with a value of `0` if this entry was created
	 * without an associated stopwatch or if the stopwatch has no recorded entries.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * // ... 1200 ms of work ...
	 * const stopEntry = sw.Stop()!;
	 * console.log(stopEntry.ElapsedTotal.Format('LONG')); // "1 second 200 milliseconds"
	 * ```
	 */
	public get ElapsedTotal(): ElapsedTime {
		if (!this._stopwatch) {
			return new ElapsedTime(0);
		}
		const firstEntry = this._stopwatch.First;
		if (!firstEntry) {
			return new ElapsedTime(0);
		}

		return new ElapsedTime(this._timestamp - firstEntry.timestamp);
	}
}
