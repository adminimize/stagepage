import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		const festival = await directus.request(
			readItem('festivals', params.params.id, {
				fields: ['*.*.*.*']
			})
		);
		return {
			festival
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			festival: null
		};
	}
};