import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const productions = await directus.request(
			readItems('productions', {
				fields: ['*', 'festivals.*', 'organizations.*', 'show.*'],
				filter: {
					status: { _eq: 'published' }
				},
				sort: ['-opening_date', 'title']
			})
		);
		return {
			productions
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			productions: []
		};
	}
};
