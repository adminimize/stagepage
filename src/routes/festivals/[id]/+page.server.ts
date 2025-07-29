import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
import { Console, Effect } from 'effect';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	return Effect.runPromise(
		Effect.gen(function* () {
			const directus = yield* Effect.tryPromise(() => createDirectusClient());
			
			const festivals = yield* Effect.tryPromise(() =>
				directus.request(
					readItems('festivals', {
						fields: [
							'id',
							'name',
							'slug',
							'description',
							'tagline',
							'start_date',
							'end_date',
							'website',
							'status',
							// Related productions with show details
							'productions.productions_id.id',
							'productions.productions_id.title',
							'productions.productions_id.slug',
							'productions.productions_id.description',
							'productions.productions_id.show.shows_id.title',
							// Related organizations
							'organizations.organizations_id.id',
							'organizations.organizations_id.name',
							'organizations.organizations_id.website',
							'organizations.organizations_id.logo',
							// Related programs
							'program.programs_id.id',
							'program.programs_id.title',
							'program.programs_id.slug'
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

			if (!festivals || festivals.length === 0) {
				yield* Effect.fail(error(404, 'Festival not found'));
			}

			return { festival: festivals[0] };
		}).pipe(
			Effect.catchAll((err) => {
				Console.error('Error loading festival:', err);
				throw error(404, 'Festival not found');
			})
		)
	);
};