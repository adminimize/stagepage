import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const venues = await directus.request(
			readItems('venues', {
				fields: ['*', 'address.*', 'address.city.*'],
				sort: ['name']
			})
		);
		return {
			venues
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			venues: []
		};
	}
};