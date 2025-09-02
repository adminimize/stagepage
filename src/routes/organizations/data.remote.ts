import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getOrganizations = query(async () => {
	const directus = await createDirectusClient();
	const organizations = await directus.request(
		readItems('organizations', {
			fields: ['*', 'logo.*', 'tags.*'],
			filter: {
				status: { _eq: 'published' }
			},
			sort: ['name']
		})
	);

	return organizations;
});


