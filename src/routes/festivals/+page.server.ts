import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const festivals = await directus.request(
			readItems('festivals', {
				fields: ['*.*'],
				filter: {
					status: { _eq: 'published' }
				},
				sort: ['-year', 'title']
			})
		);
		return {
			festivals
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			festivals: []
		};
	}
};
