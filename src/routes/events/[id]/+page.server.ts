import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const event = await directus.request(
			readItem('events', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			event
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			event: null
		};
	}
};