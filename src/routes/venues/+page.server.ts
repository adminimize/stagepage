import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
import { Console, Effect } from 'effect';

export const load = async () => {
	return Effect.runPromise(
		Effect.gen(function* () {
			const directus = yield* Effect.tryPromise(() => createDirectusClient());
			
			const venues = yield* Effect.tryPromise(() =>
				directus.request(
					readItems('venues', {
						fields: [
							'id',
							'name',
							'capacity',
							'venue_type',
							'address.street_address',
							'address.line_2',
							'address.postal_code',
							'address.city.id',
							'address.city.name',
							'address.city.province',
							'address.city.country',
							// Count of events
							'events'
						],
						sort: ['address.city.name', 'name']
					})
				)
			);

			// Group venues by city
			const groupedVenues = venues.reduce((acc, venue) => {
				const cityName = venue.address?.city?.name || 'Unknown City';
				const province = venue.address?.city?.province || 'Unknown';
				const key = `${cityName}, ${province}`;
				
				if (!acc[key]) {
					acc[key] = {
						city: venue.address?.city,
						venues: []
					};
				}
				
				acc[key].venues.push(venue);
				return acc;
			}, {} as Record<string, { city: any; venues: typeof venues }>);

			return { groupedVenues };
		}).pipe(
			Effect.catchAll((error) => {
				Console.error('Failed to load venues:', error);
				return Effect.succeed({ groupedVenues: {} });
			})
		)
	);
};