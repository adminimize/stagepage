import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getShows = query(async () => {
	const directus = await createDirectusClient();
	const shows = await directus.request(
		readItems('shows', {
			fields: ['*.*'],
			filter: {
				status: { _eq: 'published' }
			},
			sort: ['title']
		})
	);

	return shows;
});


