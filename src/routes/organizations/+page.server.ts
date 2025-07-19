import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const organizations = await directus.request(
			readItems('organizations', {
				fields: ['*', 'logo.*', 'tags.*'],
				filter: {
					status: { _eq: 'published' }
				},
				sort: ['name']
			})
		);
		return {
			organizations
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			organizations: []
		};
	}
};