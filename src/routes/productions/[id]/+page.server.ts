import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const production = await directus.request(
			readItem('productions', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			production
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			production: null
		};
	}
};