/**
 * Composes functions **right-to-left** — the rightmost function is applied first.
 *
 * Overloads are provided for up to five functions with distinct types.
 * For same-type pipelines of any length, use the variadic form.
 *
 * @example
 * ```typescript
 * const process = Compose(trim, toLowerCase, removeSpaces);
 * process('  Hello World  '); // removeSpaces(toLowerCase(trim('  Hello World  ')))
 * ```
 */
export function Compose<A, B>(f1: (a: A) => B): (a: A) => B;
export function Compose<A, B, C>(f1: (b: B) => C, f2: (a: A) => B): (a: A) => C;
export function Compose<A, B, C, D>(f1: (c: C) => D, f2: (b: B) => C, f3: (a: A) => B): (a: A) => D;
export function Compose<A, B, C, D, E>(f1: (d: D) => E, f2: (c: C) => D, f3: (b: B) => C, f4: (a: A) => B): (a: A) => E;
export function Compose<A, B, C, D, E, F>(f1: (e: E) => F, f2: (d: D) => E, f3: (c: C) => D, f4: (b: B) => C, f5: (a: A) => B): (a: A) => F;
export function Compose(...fns: Array<(arg: any) => any>): (arg: any) => any;

export function Compose(...fns: Array<(arg: any) => any>): (arg: any) => any {
	return (arg: any) => fns.reduceRight((v, fn) => fn(v), arg);
}

/**
 * Pipes functions **left-to-right** — the leftmost function is applied first.
 *
 * Overloads are provided for up to five functions with distinct types.
 * For same-type pipelines of any length, use the variadic form.
 *
 * @example
 * ```typescript
 * const process = Pipe(trim, toLowerCase, removeSpaces);
 * process('  Hello World  '); // removeSpaces(toLowerCase(trim('  Hello World  ')))
 * ```
 */
export function Pipe<A, B>(f1: (a: A) => B): (a: A) => B;
export function Pipe<A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C;
export function Pipe<A, B, C, D>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): (a: A) => D;
export function Pipe<A, B, C, D, E>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E): (a: A) => E;
export function Pipe<A, B, C, D, E, F>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E, f5: (e: E) => F): (a: A) => F;
export function Pipe(...fns: Array<(arg: any) => any>): (arg: any) => any;

export function Pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
	return (arg: any) => fns.reduce((v, fn) => fn(v), arg);
}
