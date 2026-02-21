/**
 * Extracts the element type from an array type.
 * @example
 * type T = TArrayElement<string[]>; // T is string
 */
export type TArrayElement<A> = A extends readonly (infer T)[] ? T : never;
