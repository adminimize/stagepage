import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getFestivals = query(async () => {
	const directus = await createDirectusClient();
	const festivals = await directus.request(
		readItems('festivals', {
			fields: ['*.*']
		})
	);

	return festivals;
});


