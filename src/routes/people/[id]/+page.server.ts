import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const person = await directus.request(
			readItem('people', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			person
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			person: null
		};
	}
};