import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const song = await directus.request(
			readItem('songs', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			song
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			song: null
		};
	}
};