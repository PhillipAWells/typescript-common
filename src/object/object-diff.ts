/** Describes the differences between two objects at the top level. */
export interface IObjectDiffResult {
	/** Keys present in `objB` but not in `objA`. */
	added: Record<string, unknown>;
	/** Keys present in `objA` but not in `objB`. */
	removed: Record<string, unknown>;
	/** Keys present in both objects whose values differ. */
	changed: Record<string, { from: unknown; to: unknown }>;
}

/**
 * Computes a shallow diff between two objects.
 *
 * Returns three groups:
 * - **added** — keys in `objB` that are absent from `objA`
 * - **removed** — keys in `objA` that are absent from `objB`
 * - **changed** — keys present in both whose values are not strictly equal
 *   (compared via `JSON.stringify` for deep value equality)
 *
 * **Important**: Value comparison uses `JSON.stringify`, which has limitations:
 * - Functions, `undefined`, and `Symbol` values are not compared correctly
 *   (they may serialize to `undefined` or be omitted)
 * - Circular references will throw an error
 * - Objects with identical structure but different prototypes are considered equal
 *
 * For values containing functions, `undefined`, symbols, or circular references,
 * consider a custom comparison function or pre-filtering the objects.
 *
 * @param objA - The baseline object ("before")
 * @param objB - The comparison object ("after")
 * @returns {@link IObjectDiffResult}
 *
 * @example
 * ```typescript
 * ObjectDiff(
 *   { a: 1, b: 2, c: 3 },
 *   { b: 99, c: 3, d: 4 },
 * );
 * // {
 * //   added:   { d: 4 },
 * //   removed: { a: 1 },
 * //   changed: { b: { from: 2, to: 99 } },
 * // }
 * ```
 */
export function ObjectDiff(
	objA: Record<string, unknown>,
	objB: Record<string, unknown>,
): IObjectDiffResult {
	const result: IObjectDiffResult = { added: {}, removed: {}, changed: {} };
	const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

	for (const key of allKeys) {
		const inA = Object.prototype.hasOwnProperty.call(objA, key);
		const inB = Object.prototype.hasOwnProperty.call(objB, key);

		if (inA && !inB) {
			result.removed[key] = objA[key];
		} else if (!inA && inB) {
			result.added[key] = objB[key];
		} else if (JSON.stringify(objA[key]) !== JSON.stringify(objB[key])) {
			result.changed[key] = { from: objA[key], to: objB[key] };
		}
	}

	return result;
}
