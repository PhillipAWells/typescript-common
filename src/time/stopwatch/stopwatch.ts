import { ElapsedTime } from '../elapsed-time/elapsed-time.js';
import { StopwatchEntry } from './entry.js';

/**
 * Represents a stopwatch for measuring time intervals.
 *
 * A `Stopwatch` records a chronological list of {@link StopwatchEntry} timestamps
 * and can be started, stopped, paused, resumed, lapped, and reset. The elapsed
 * time is computed from the recorded entries rather than an active timer, so it
 * is always accurate even after the stopwatch has been stopped.
 *
 * @example
 * ```typescript
 * // Basic start/stop usage
 * const sw = new Stopwatch();
 * sw.Start();
 * // ... do work ...
 * sw.Stop();
 * console.log(sw.Elapsed.Format('CONCISE')); // e.g. "1s 250ms"
 *
 * // Start immediately via constructor
 * const sw2 = new Stopwatch(true);
 * // ... do work ...
 * console.log(sw2.Elapsed.Format('MEDIUM')); // e.g. "2 sec 300 ms"
 * ```
 */
export class Stopwatch {
	private _times: StopwatchEntry[] = [];

	private _pausedAt: number | null = null;

	/**
	 * Creates a new `Stopwatch` instance.
	 *
	 * @param startImmediately - When `true`, calls {@link Start} automatically
	 *   so the stopwatch begins tracking time as soon as it is constructed.
	 *   Defaults to `false`.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch();          // not yet running
	 * const sw2 = new Stopwatch(true);     // running immediately
	 * ```
	 */
	constructor(startImmediately: boolean = false) {
		if (startImmediately) {
			this.Start();
		}
	}

	/**
	 * Whether the stopwatch is currently running (started and not paused/stopped).
	 *
	 * @returns `true` if the stopwatch has been started and is not currently paused or stopped.
	 */
	public get Running(): boolean {
		return this.First !== undefined && this._pausedAt === null;
	}

	/**
	 * The first entry recorded by this stopwatch (i.e. the start entry).
	 *
	 * @returns The first {@link StopwatchEntry}, or `undefined` if the stopwatch
	 *   has never been started.
	 */
	public get First(): StopwatchEntry | undefined {
		return this._times.length === 0 ? undefined : this._times[0];
	}

	/**
	 * The most recently recorded entry.
	 *
	 * @returns The latest {@link StopwatchEntry}, or `undefined` if no entries
	 *   have been recorded yet.
	 */
	public get Latest(): StopwatchEntry | undefined {
		return this._times.length === 0 ? undefined : this._times[this._times.length - 1];
	}

	/**
	 * The total time elapsed since the stopwatch was first started.
	 *
	 * - While the stopwatch is **running**, this reflects the time between the
	 *   first entry and `Date.now()`.
	 * - While the stopwatch is **paused or stopped**, this reflects the time
	 *   between the first entry and the moment it was paused/stopped.
	 * - Returns an {@link ElapsedTime} of `0` if the stopwatch has never been started.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * // ... 500ms later ...
	 * sw.Stop();
	 * console.log(sw.Elapsed.Format()); // "500ms"
	 * ```
	 */
	public get Elapsed(): ElapsedTime {
		const current = Date.now();
		if (!this.Latest) return new ElapsedTime(0);

		const first = this.First;
		if (!first) return new ElapsedTime(0);

		if (this._pausedAt !== null) {
			return new ElapsedTime(this._pausedAt - first.timestamp);
		}

		return new ElapsedTime(current - first.timestamp);
	}

	/**
	 * A shallow copy of all recorded {@link StopwatchEntry} objects in
	 * chronological order.
	 *
	 * Modifying the returned array does not affect the internal state.
	 */
	public get Times(): StopwatchEntry[] {
		return [...this._times];
	}

	/**
	 * Alias for {@link Times}. Returns a shallow copy of all recorded entries.
	 */
	public get Entries(): StopwatchEntry[] {
		return this.Times;
	}

	/**
	 * The timestamp (milliseconds since epoch) at which the stopwatch was last
	 * paused or stopped, or `null` if it is currently running.
	 */
	public get PausedAt(): number | null {
		return this._pausedAt;
	}

	/**
	 * Starts the stopwatch by recording an initial timestamp entry.
	 *
	 * If the stopwatch has already been started, this is a no-op and the
	 * existing latest entry is returned without creating a new one.
	 *
	 * @returns The start {@link StopwatchEntry} that was recorded, or `undefined`
	 *   if the stopwatch was already running (should not happen in practice).
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch();
	 * const entry = sw.Start();
	 * console.log(sw.Running); // true
	 * ```
	 */
	public Start(): StopwatchEntry | undefined {
		if (this.Latest) return this.Latest;

		this._pausedAt = null;

		const entry = new StopwatchEntry(Date.now(), this, this._times.length);
		this._times.push(entry);
		return entry;
	}

	/**
	 * Stops the stopwatch by recording a final timestamp entry.
	 *
	 * - If the stopwatch is currently running, the current time is recorded as
	 *   the stop entry and `_pausedAt` is set to freeze the elapsed time.
	 * - If the stopwatch has already been stopped, the latest entry is returned
	 *   unchanged (idempotent).
	 * - If the stopwatch was never started, returns `undefined`.
	 *
	 * @returns The stop {@link StopwatchEntry}, or `undefined` if the stopwatch
	 *   had not been started.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * // ... some work ...
	 * const stopEntry = sw.Stop();
	 * console.log(sw.Running); // false
	 * console.log(sw.Elapsed.Format()); // e.g. "500ms"
	 * ```
	 */
	public Stop(): StopwatchEntry | undefined {
		const latest = this.Latest;
		if (!latest) return undefined;

		if (this._pausedAt === null) {
			// Not stopped yet, so stop it
			const current = Date.now();
			this._pausedAt = current;

			const entry = new StopwatchEntry(current, this, this._times.length);
			this._times.push(entry);
			return entry;
		} else {
			// Already stopped, just return latest
			return latest;
		}
	}

	/**
	 * Pauses the stopwatch, freezing the elapsed time at the current moment.
	 *
	 * If the stopwatch has not been started, returns `null`. Unlike {@link Stop},
	 * `Pause` does not record a new timestamp entry — it only sets the internal
	 * pause marker so that subsequent reads of {@link Elapsed} return a frozen value.
	 *
	 * @returns The latest {@link StopwatchEntry} at the time of pausing, or `null`
	 *   if the stopwatch had not been started.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * // ... 200ms ...
	 * sw.Pause();
	 * // ... 500ms later ...
	 * console.log(sw.Elapsed.Format()); // still "200ms"
	 * sw.Resume();
	 * ```
	 */
	public Pause(): StopwatchEntry | null {
		const latest = this.Latest;
		if (!latest) return null;

		this._pausedAt = Date.now();
		return latest;
	}

	/**
	 * Resumes a paused stopwatch by recording a new timestamp entry.
	 *
	 * If the stopwatch is not currently paused, returns `null` and has no effect.
	 * After resuming, elapsed-time calculations continue to accumulate from where
	 * they left off.
	 *
	 * @returns A new {@link StopwatchEntry} recording the resume time, or `null`
	 *   if the stopwatch was not paused.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * sw.Pause();
	 * const resumeEntry = sw.Resume();
	 * console.log(sw.Running); // true
	 * ```
	 */
	public Resume(): StopwatchEntry | null {
		if (this._pausedAt === null) return null;

		const current = Date.now();
		this._pausedAt = null;

		const entry = new StopwatchEntry(current, this, this._times.length);
		this._times.push(entry);
		return entry;
	}

	/**
	 * Records a click entry at the current moment without changing the
	 * running/paused state.
	 *
	 * If the stopwatch has no entries yet, the first click implicitly starts it.
	 * Use this for arbitrary timestamp recording or as the building block for
	 * {@link Lap}.
	 *
	 * @returns The newly recorded {@link StopwatchEntry}.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * const mark = sw.Click();
	 * console.log(mark.Elapsed.Format()); // time since last click / start
	 * ```
	 */
	public Click(): StopwatchEntry {
		const current = Date.now();
		if (this._times.length === 0) {
			// First click starts the stopwatch
			this._pausedAt = null;
		}
		const entry = new StopwatchEntry(current, this, this._times.length);
		this._times.push(entry);
		return entry;
	}

	/**
	 * Records a lap by clicking the stopwatch and returning the elapsed time
	 * since the previous entry.
	 *
	 * Internally calls {@link Click} to record a new entry, then computes the
	 * difference between the new entry's timestamp and the previous one.
	 * Returns `ElapsedTime(0)` if this is the very first entry recorded.
	 *
	 * @returns An {@link ElapsedTime} representing the lap duration.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * // ... 300ms ...
	 * const lap1 = sw.Lap(); // ~300ms
	 * // ... 150ms ...
	 * const lap2 = sw.Lap(); // ~150ms
	 * ```
	 */
	public Lap(): ElapsedTime {
		const previousLatest = this.Latest;
		const newEntry = this.Click();
		if (!previousLatest) {
			return new ElapsedTime(0);
		}

		return new ElapsedTime(newEntry.timestamp - previousLatest.timestamp);
	}

	/**
	 * Resets the stopwatch to its initial state by clearing all recorded entries
	 * and removing any pause/stop marker.
	 *
	 * After calling `Reset()`, the stopwatch is in the same state as a freshly
	 * constructed instance. Call {@link Start} to begin timing again.
	 *
	 * @example
	 * ```typescript
	 * const sw = new Stopwatch(true);
	 * sw.Stop();
	 * sw.Reset();
	 * console.log(sw.Running); // false
	 * console.log(sw.Times);   // []
	 * ```
	 */
	public Reset(): void {
		this._times = [];
		this._pausedAt = null;
	}
}
