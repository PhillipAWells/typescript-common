import { describe, it, expect, vi } from 'vitest';
import { Debounce } from './debounce.js';
import { Throttle } from './throttle.js';
import { Memoize } from './memoize.js';
import { Once } from './once.js';
import { Compose, Pipe } from './compose.js';
import { Sleep } from './sleep.js';

describe('Debounce', () => {
	it('delays invocation', async () => {
		const fn = vi.fn();
		const debounced = Debounce(fn, 50);

		debounced();
		debounced();
		debounced();

		expect(fn).not.toHaveBeenCalled();
		await Sleep(80);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('calls with the latest arguments', async () => {
		const fn = vi.fn();
		const debounced = Debounce(fn, 50);

		debounced('a');
		debounced('b');
		debounced('c');

		await Sleep(80);
		expect(fn).toHaveBeenCalledWith('c');
	});

	it('cancel prevents the pending call', async () => {
		const fn = vi.fn();
		const debounced = Debounce(fn, 50);

		debounced();
		debounced.cancel();

		await Sleep(80);
		expect(fn).not.toHaveBeenCalled();
	});

	it('allows a fresh call after cancel', async () => {
		const fn = vi.fn();
		const debounced = Debounce(fn, 50);

		debounced();
		debounced.cancel();
		debounced();

		await Sleep(80);
		expect(fn).toHaveBeenCalledTimes(1);
	});
});

describe('Throttle', () => {
	it('calls the function immediately on first invocation', () => {
		const fn = vi.fn();
		const throttled = Throttle(fn, 100);

		throttled();
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('does not call again within the interval', () => {
		const fn = vi.fn();
		const throttled = Throttle(fn, 100);

		throttled();
		throttled();
		throttled();
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('calls again after the interval has elapsed', async () => {
		const fn = vi.fn();
		const throttled = Throttle(fn, 50);

		throttled();
		await Sleep(80);
		throttled();
		expect(fn).toHaveBeenCalledTimes(2);
	});
});

describe('Memoize', () => {
	it('returns cached result on repeated calls', () => {
		const fn = vi.fn((n: number) => n * n);
		const memo = Memoize(fn);

		expect(memo(4)).toBe(16);
		expect(memo(4)).toBe(16);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('computes separately for different arguments', () => {
		const fn = vi.fn((n: number) => n * 2);
		const memo = Memoize(fn);

		expect(memo(3)).toBe(6);
		expect(memo(5)).toBe(10);
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it('uses a custom key function', () => {
		const fn = vi.fn((obj: { id: number }) => obj.id * 10);
		const memo = Memoize(fn, (obj) => String(obj.id));

		expect(memo({ id: 1 })).toBe(10);
		expect(memo({ id: 1 })).toBe(10);
		expect(fn).toHaveBeenCalledTimes(1);
	});
});

describe('Once', () => {
	it('calls the function only once', () => {
		const fn = vi.fn(() => 42);
		const once = Once(fn);

		expect(once()).toBe(42);
		expect(once()).toBe(42);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('always returns the result of the first call', () => {
		let counter = 0;
		const once = Once(() => ++counter);

		expect(once()).toBe(1);
		expect(once()).toBe(1);
		expect(once()).toBe(1);
	});
});

describe('Compose', () => {
	it('applies functions right-to-left', () => {
		const addOne = (n: number) => n + 1;
		const double = (n: number) => n * 2;
		const square = (n: number) => n * n;

		// square first, then double, then addOne
		const fn = Compose(addOne, double, square);
		expect(fn(3)).toBe(addOne(double(square(3)))); // (3²=9, *2=18, +1=19)
		expect(fn(3)).toBe(19);
	});

	it('handles a single function', () => {
		const fn = Compose((n: number) => n + 10);
		expect(fn(5)).toBe(15);
	});

	it('returns the value unchanged when no functions provided', () => {
		const fn = Compose();
		expect(fn(42)).toBe(42);
	});
});

describe('Pipe', () => {
	it('applies functions left-to-right', () => {
		const addOne = (n: number) => n + 1;
		const double = (n: number) => n * 2;
		const square = (n: number) => n * n;

		// addOne first, then double, then square
		const fn = Pipe(addOne, double, square);
		expect(fn(3)).toBe(square(double(addOne(3)))); // (3+1=4, *2=8, 8²=64)
		expect(fn(3)).toBe(64);
	});

	it('handles a single function', () => {
		const fn = Pipe((s: string) => s.toUpperCase());
		expect(fn('hello')).toBe('HELLO');
	});

	it('is the reverse of Compose', () => {
		const inc = (n: number) => n + 1;
		const dbl = (n: number) => n * 2;

		expect(Pipe(inc, dbl)(5)).toBe(Compose(dbl, inc)(5));
	});
});

describe('Sleep', () => {
	it('resolves after the specified delay', async () => {
		const start = Date.now();
		await Sleep(50);
		expect(Date.now() - start).toBeGreaterThanOrEqual(40);
	});

	it('returns a Promise', () => {
		expect(Sleep(0)).toBeInstanceOf(Promise);
	});
});
