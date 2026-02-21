/** Any function signature. */
export type TAnyFunction = (...args: any[]) => any;

/** Any async function signature. */
export type TAsyncFunction<T = void> = (...args: any[]) => Promise<T>;
