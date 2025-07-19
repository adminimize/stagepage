import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const venue = await directus.request(
			readItem('venues', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			venue
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			venue: null
		};
	}
};