import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const shows = await directus.request(
			readItems('shows', {
				fields: ['*.*'],
				limit: 10
			})
		);
		return {
			shows
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			shows: []
		};
	}
};
