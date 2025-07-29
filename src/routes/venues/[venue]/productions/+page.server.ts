import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async (params) => {
	const venueName = decodeURIComponent(params.params.venue);
	
	try {
		const directus = await createDirectusClient();
		
		// Fetch all productions at this venue
		const productionsResult = await directus.request(
			readItems('productions', {
				fields: [
					'*',
					'festivals.festivals_id.*',
					'organizations.organizations_id.*',
					'show.shows_id.*'
				],
				filter: {
					venue: { _eq: venueName },
					status: { _eq: 'published' }
				},
				sort: ['-opening_date']
			})
		);

		// Get unique years from productions
		const years = [...new Set(
			productionsResult
				.filter(p => p.opening_date)
				.map(p => new Date(p.opening_date).getFullYear())
		)].sort((a, b) => b - a);

		return {
			venue: venueName,
			productions: productionsResult,
			years
		};
	} catch (error) {
		console.error('Error fetching venue productions:', error);
		return {
			venue: venueName,
			productions: [],
			years: []
		};
	}
};