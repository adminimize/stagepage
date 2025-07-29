import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const load = async (params) => {
	const city = decodeURIComponent(params.params.city);
	
	try {
		const directus = await createDirectusClient();
		
		// First, find all festivals in this city
		const festivalsResult = await directus.request(
			readItems('festivals', {
				fields: ['id', 'title', 'year', 'location'],
				filter: {
					location: { _icontains: city },
					status: { _eq: 'published' }
				}
			})
		);

		const festivalIds = festivalsResult.map(f => f.id);

		// Then fetch all productions associated with these festivals
		const productionsResult = await directus.request(
			readItems('productions', {
				fields: [
					'*',
					'festivals.festivals_id.*',
					'organizations.organizations_id.*',
					'show.shows_id.*'
				],
				filter: {
					_and: [
						{ status: { _eq: 'published' } },
						{
							_or: [
								// Productions at festivals in this city
								{
									festivals: {
										festivals_id: { _in: festivalIds }
									}
								},
								// Productions with venue containing city name
								{
									venue: { _icontains: city }
								}
							]
						}
					]
				},
				sort: ['-opening_date']
			})
		);

		// Get unique years and venues
		const years = [...new Set(
			productionsResult
				.filter(p => p.opening_date)
				.map(p => new Date(p.opening_date).getFullYear())
		)].sort((a, b) => b - a);

		const venues = [...new Set(
			productionsResult
				.filter(p => p.venue)
				.map(p => p.venue)
		)].sort();

		return {
			city,
			productions: productionsResult,
			festivals: festivalsResult,
			years,
			venues
		};
	} catch (error) {
		console.error('Error fetching city productions:', error);
		return {
			city,
			productions: [],
			festivals: [],
			years: [],
			venues: []
		};
	}
};