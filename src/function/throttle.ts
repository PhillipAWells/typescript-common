/**
 * Creates a throttled version of `fn` that invokes at most once per `ms`
 * milliseconds, guaranteeing the final call in a burst is also executed.
 *
 * @template T - The wrapped function type
 * @param fn - The function to throttle
 * @param ms - Minimum interval in milliseconds between invocations
 * @returns A throttled function
 *
 * @example
 * ```typescript
 * const onScroll = Throttle(() => updatePosition(), 100);
 * window.addEventListener('scroll', onScroll);
 * ```
 */
export function Throttle<T extends (...args: any[]) => any>(
	fn: T,
	ms: number,
): (...args: Parameters<T>) => void {
	let lastCall = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	return function throttled(...args: Parameters<T>): void {
		const now = Date.now();
		const remaining = ms - (now - lastCall);

		if (remaining <= 0) {
			clearTimeout(timer);
			timer = undefined;
			lastCall = now;
			fn(...args);
		} else {
			timer ??= setTimeout(() => {
				lastCall = Date.now();
				timer = undefined;
				fn(...args);
			}, remaining);
		}
	};
}
