export function groupBy<T, K extends string | number | symbol>(
	items: T[],
	keyFn: (item: T) => K
): Record<K, T[]> {
	return items.reduce((acc, item) => {
		const key = keyFn(item);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(item);
		return acc;
	}, {} as Record<K, T[]>);
}