import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
import { Console, Effect } from 'effect';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	return Effect.runPromise(
		Effect.gen(function* () {
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
							'show.shows_id.description',
							// Related programs
							'programs.id',
							'programs.title',
							'programs.slug',
							'programs.published_date',
							// Related events with venues
							'events.id',
							'events.title',
							'events.start',
							'events.end',
							'events.special_notes',
							'events.venue.venues_id.id',
							'events.venue.venues_id.name',
							'events.venue.venues_id.capacity',
							'events.venue.venues_id.address.street_address',
							'events.venue.venues_id.address.city.name',
							'events.venue.venues_id.address.city.province',
							// Related organizations
							'organizations.organizations_id.id',
							'organizations.organizations_id.name',
							'organizations.organizations_id.website',
							'organizations.organizations_id.logo',
							// Related festivals
							'festivals.festivals_id.id',
							'festivals.festivals_id.name',
							'festivals.festivals_id.slug',
							// Related series
							'series.series_id.id',
							'series.series_id.name',
							'series.series_id.type',
							'series.series_id.year',
							// Related credits
							'credits.credits_id.id',
							'credits.credits_id.program_override',
							'credits.credits_id.role.name',
							'credits.credits_id.role.type',
							'credits.credits_id.people.people_id.full_name',
							'credits.credits_id.people.people_id.stage_name',
							'credits.credits_id.people.people_id.headshot'
						],
						filter: {
							_or: [
								{ id: { _eq: params.id } },
								{ slug: { _eq: params.id } }
							]
						},
						limit: 1
					})
				)
			);

			if (!productions || productions.length === 0) {
				yield* Effect.fail(error(404, 'Production not found'));
			}

			return { production: productions[0] };
		}).pipe(
			Effect.catchAll((err) => {
				Console.error('Error loading production:', err);
				throw error(404, 'Production not found');
			})
		)
	);
};