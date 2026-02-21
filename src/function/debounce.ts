/**
 * Creates a debounced version of `fn` that delays execution until after `ms`
 * milliseconds have elapsed since the last invocation.
 *
 * The returned function also exposes a `.cancel()` method to discard any
 * pending invocation.
 *
 * @template T - The wrapped function type
 * @param fn - The function to debounce
 * @param ms - Delay in milliseconds
 * @returns A debounced function with a `.cancel()` method
 *
 * @example
 * ```typescript
 * const save = Debounce((value: string) => api.save(value), 300);
 * input.addEventListener('input', (e) => save(e.target.value));
 *
 * // Cancel a pending call:
 * save.cancel();
 * ```
 */
export function Debounce<T extends (...args: any[]) => any>(
	fn: T,
	ms: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
	let timer: ReturnType<typeof setTimeout> | undefined;

	function debounced(...args: Parameters<T>): void {
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
			fn(...args);
		}, ms);
	}

	debounced.cancel = (): void => {
		clearTimeout(timer);
		timer = undefined;
	};

	return debounced;
}
