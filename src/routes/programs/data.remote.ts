import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getPrograms = query(async () => {
	const directus = await createDirectusClient();
    const programs = await directus.request(
        readItems('programs', {
            fields: ['*', 'production.*', 'festival.*'],
        })
    );

	return programs;
});