import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems, readItem } from '@directus/sdk';

export const getEvents = query(async () => {
	const directus = await createDirectusClient();
	const events = await directus.request(
		readItems('events', {
			fields: ['*', 'venue.*.*', 'program.*.*'],
			filter: {
				status: { _eq: 'published' }
			},
			sort: ['start']
		})
	);

	return events;
});

export const getEvent = query('unchecked', async (id: string) => {
	const directus = await createDirectusClient();
	const event = await directus.request(
		readItem('events', id, {
			fields: [
				'*',
				// two layers deep
				'program.*.*',
				'venue.*.*',
				// include common nested details
				'program.programs_id.production.*',
				'venue.venues_id.address.*',
				'venue.venues_id.address.city.*'
			]
		})
	);

	return event;
});


