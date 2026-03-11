/**
 * Wraps `fn` so it can only be called **once**.
 * Subsequent calls return the cached result of the first invocation.
 *
 * @template T - The wrapped function type
 * @param fn - The function to restrict
 * @returns A wrapped function that executes `fn` at most once
 *
 * @example
 * ```typescript
 * const init = Once(() => expensiveSetup());
 * init(); // runs expensiveSetup()
 * init(); // no-op — returns cached result
 * ```
 */
export function Once<T extends (...args: any[]) => any>(fn: T): T {
	let called = false;
	let result: ReturnType<T>;
	let error: unknown;
	let hasError = false;

	return function once(...args: Parameters<T>): ReturnType<T> {
		if (hasError) {
			throw error;
		}
		if (!called) {
			try {
				result = fn(...args) as ReturnType<T>;
				called = true;
			} catch (e) {
				error = e;
				hasError = true;
				throw e;
			}
		}
		return result;
	} as T;
}
