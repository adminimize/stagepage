import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
import { Console, Effect } from 'effect';

export const load = async () => {
	return Effect.runPromise(
		Effect.gen(function* () {
			const directus = yield* Effect.tryPromise(() => createDirectusClient());
			
			const cities = yield* Effect.tryPromise(() =>
				directus.request(
					readItems('cities', {
						fields: [
							'id',
							'name',
							'province',
							'country'
						],
						sort: ['country', 'province', 'name']
					})
				)
			);

			// Group cities by country and province
			const groupedCities = cities.reduce((acc, city) => {
				const country = city.country || 'CA';
				const province = city.province || 'Unknown';
				
				if (!acc[country]) {
					acc[country] = {};
				}
				if (!acc[country][province]) {
					acc[country][province] = [];
				}
				
				acc[country][province].push(city);
				return acc;
			}, {} as Record<string, Record<string, typeof cities>>);

			return { groupedCities };
		}).pipe(
			Effect.catchAll((error) => {
				Console.error('Failed to load cities:', error);
				return Effect.succeed({ groupedCities: {} });
			})
		)
	);
};