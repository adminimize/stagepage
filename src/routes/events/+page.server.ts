import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
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
		return {
			events
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			events: []
		};
	}
};