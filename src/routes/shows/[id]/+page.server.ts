import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const load = async (params) => {
	try {
		console.log('Loading data...', params.params.id);
		const directus = await createDirectusClient();
		const show = await directus.request(
			readItem('shows', params.params.id, {
				fields: ['*.*.*']
			})
		);
		console.log(show);
		return {
			show
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			show: []
		};
	}
};
