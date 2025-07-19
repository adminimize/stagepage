import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const songs = await directus.request(
			readItems('songs', {
				fields: ['*', 'credits.*', 'shows.*'],

				sort: ['title']
			})
		);
		return {
			songs
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			songs: []
		};
	}
};
