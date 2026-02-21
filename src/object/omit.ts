/**
 * Creates a new object without the specified keys from the source object
 * @param obj Source object
 * @param keys Keys to omit
 * @returns New object without the specified keys
 */
export function ObjectOmit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	if (!obj) {
		return {} as Omit<T, K>;
	}

	const result = { ...obj };
	keys.forEach((key) => {
		delete result[key];
	});
	return result as Omit<T, K>;
}
