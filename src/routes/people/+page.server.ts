import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const people = await directus.request(
			readItems('people', {
				fields: ['*', 'pronouns.*', 'headshot.*'],
				sort: ['full_name']
			})
		);
		return {
			people
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			people: []
		};
	}
};
