import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async () => {
	try {
		const directus = await createDirectusClient();
		const programs = await directus.request(
			readItems('programs', {
				fields: ['*', 'production.*', 'festival.*'],
			})
		);
		return {
			programs
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			programs: []
		};
	}
};
