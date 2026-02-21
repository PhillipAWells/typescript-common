/**
 * Predicate function type for filtering and validation
 * @template T - The type of value being tested
 * @param value - The value to test
 * @returns true if the value passes the predicate, false otherwise
 */
export type TPredicate<T> = (value: T) => boolean;

/**
 * Transformer function type for mapping operations
 * @template TInput - The input type
 * @template TOutput - The output type
 * @param input - The value to transform
 * @returns The transformed value
 */
export type TTransform<TInput, TOutput> = (input: TInput) => TOutput;

/**
 * Comparator function type for sorting and comparison
 * @template T - The type of values being compared
 * @param a - First value
 * @param b - Second value
 * @returns Negative if a < b, zero if a === b, positive if a > b
 */
export type TComparator<T> = (a: T, b: T) => number;

/**
 * Equality comparator function type
 * @template T - The type of values being compared
 * @param a - First value
 * @param b - Second value
 * @returns true if values are equal, false otherwise
 */
export type TEqualityComparator<T> = (a: T, b: T) => boolean;
