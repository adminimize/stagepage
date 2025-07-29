import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';
export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const festivals = await directus.request(
			readItems('festivals', {
				fields: ['*.*']
			})
		);
		return { festivals };
	} catch (error) {
		console.error('Error loading festivals:', error);
		return { festivals: [] };
	}
};
