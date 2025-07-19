import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const organization = await directus.request(
			readItem('organizations', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			organization
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			organization: null
		};
	}
};