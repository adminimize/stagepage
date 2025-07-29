import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
import { Console, Effect } from 'effect';

export const load = async () => {
	return Effect.runPromise(
		Effect.gen(function* () {
			yield* Console.log('Loading productions...');
			
			const directus = yield* Effect.tryPromise(() => createDirectusClient());
			const productions = yield* Effect.tryPromise(() =>
				directus.request(
					readItems('productions', {
						fields: [
							'id',
							'title',
							'slug',
							'description',
							'website',
							'status',
							// Related show information
							'show.shows_id.id',
							'show.shows_id.title',
							'show.shows_id.slug',
							// Related festivals
							'festivals.festivals_id.id',
							'festivals.festivals_id.name',
							'festivals.festivals_id.slug',
							'festivals.festivals_id.start_date',
							// Related organizations
							'organizations.organizations_id.id',
							'organizations.organizations_id.name',
							'organizations.organizations_id.logo',
							// Related events for dates
							'events.id',
							'events.start',
							'events.end',
							'events.venue.venues_id.name'
						],
						filter: {
							status: { _eq: 'published' }
						},
						sort: ['-date_created', 'title']
					})
				)
			);
			
			yield* Console.log(`Loaded ${productions.length} productions`);
			return { productions };
		}).pipe(
			Effect.catchAll((error) => {
				Console.error('Failed to load productions:', error);
				return Effect.succeed({ productions: [] });
			})
		)
	);
};
