import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
import { Console, Effect } from 'effect';

export const load = async () => {
	return Effect.runPromise(
		Effect.gen(function* () {
			const directus = yield* Effect.tryPromise(() => createDirectusClient());
			
			// Get all series to extract years
			const series = yield* Effect.tryPromise(() =>
				directus.request(
					readItems('series', {
						fields: ['year', 'type'],
						filter: {
							year: { _nnull: true }
						}
					})
				)
			);

			// Get all festivals to extract years from dates
			const festivals = yield* Effect.tryPromise(() =>
				directus.request(
					readItems('festivals', {
						fields: ['start_date', 'end_date'],
						filter: {
							_or: [
								{ start_date: { _nnull: true } },
								{ end_date: { _nnull: true } }
							]
						}
					})
				)
			);

			// Extract years and count occurrences
			const yearCounts: Record<number, { total: number; series: number; festivals: number }> = {};

			// Count series years
			series.forEach(s => {
				if (s.year) {
					if (!yearCounts[s.year]) {
						yearCounts[s.year] = { total: 0, series: 0, festivals: 0 };
					}
					yearCounts[s.year].series++;
					yearCounts[s.year].total++;
				}
			});

			// Count festival years
			festivals.forEach(f => {
				const year = f.start_date 
					? new Date(f.start_date).getFullYear()
					: f.end_date 
					? new Date(f.end_date).getFullYear()
					: null;
				
				if (year && year >= 1900 && year <= 2100) { // Sanity check
					if (!yearCounts[year]) {
						yearCounts[year] = { total: 0, series: 0, festivals: 0 };
					}
					yearCounts[year].festivals++;
					yearCounts[year].total++;
				}
			});

			// Convert to sorted array
			const years = Object.entries(yearCounts)
				.map(([year, counts]) => ({
					year: parseInt(year),
					...counts
				}))
				.sort((a, b) => b.year - a.year);

			return { years };
		}).pipe(
			Effect.catchAll((error) => {
				Console.error('Failed to load years:', error);
				return Effect.succeed({ years: [] });
			})
		)
	);
};