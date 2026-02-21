import { ElapsedTime } from '../elapsed-time/elapsed-time.js';

/**
 * Represents a single timestamp entry recorded by the stopwatch.
 */
export interface IStopwatchEntryData {
	/** The timestamp when this entry was recorded (milliseconds since epoch) */
	timestamp: number;
	/** The elapsed time since the previous entry */
	elapsed: ElapsedTime;
	/** The total elapsed time since the stopwatch was first started */
	elapsedTotal: ElapsedTime;
}
