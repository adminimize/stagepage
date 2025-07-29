import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async (params) => {
	const year = parseInt(params.params.year);
	
	if (isNaN(year) || year < 1900 || year > 2100) {
		return {
			year,
			productions: [],
			festivals: []
		};
	}

	try {
		const directus = await createDirectusClient();
		
		// Fetch all productions that occurred in this year
		const productionsResult = await directus.request(
			readItems('productions', {
				fields: [
					'*',
					'festivals.festivals_id.*',
					'organizations.organizations_id.*',
					'show.shows_id.*'
				],
				filter: {
					_or: [
						{
							opening_date: {
								_between: [`${year}-01-01`, `${year}-12-31`]
							}
						},
						{
							closing_date: {
								_between: [`${year}-01-01`, `${year}-12-31`]
							}
						}
					],
					status: { _eq: 'published' }
				},
				sort: ['-opening_date']
			})
		);

		// Also fetch festivals from that year
		const festivalsResult = await directus.request(
			readItems('festivals', {
				fields: ['*'],
				filter: {
					year: { _eq: year },
					status: { _eq: 'published' }
				},
				sort: ['start_date']
			})
		);

		return {
			year,
			productions: productionsResult,
			festivals: festivalsResult
		};
	} catch (error) {
		console.error('Error fetching year data:', error);
		return {
			year,
			productions: [],
			festivals: []
		};
	}
};
