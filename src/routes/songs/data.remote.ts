import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getSongs = query(async () => {
	const directus = await createDirectusClient();
	const songs = await directus.request(
		readItems('songs', {
			fields: ['*', 'credits.*', 'shows.*'],
			sort: ['title']
		})
	);

	return songs;
});


