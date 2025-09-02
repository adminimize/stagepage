import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getPeople = query(async () => {
	const directus = await createDirectusClient();
	const people = await directus.request(
		readItems('people', {
			fields: ['*', 'pronouns.*', 'headshot.*'],
			sort: ['full_name']
		})
	);

	return people;
});


