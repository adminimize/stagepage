import { createDirectusClient } from '$lib/directus';
import { readItem, readItems } from '@directus/sdk';

export const load = async (params) => {
	try {
		const directus = await createDirectusClient();
		
		// Fetch the main program with deep relationships
		const program = await directus.request(
			readItem('programs', params.params.id, {
				fields: [
					'*',
					'production.*',
					'festival.*.*',
					'sections.*',
					'songs.*.*',
					'events.*.*',
					'credits.*.*.*',
					'sponsors.*.*.*'
				]
			})
		);

		// Fetch detailed section data for each section type
		const sectionsWithData = [];
		
		if (program.sections) {
			for (const section of program.sections) {
				let sectionData = { ...section };
				
				try {
					// Fetch the actual section content based on collection type
					const sectionContent = await directus.request(
						readItem(section.collection, section.item, {
							fields: ['*.*.*.*']
						})
					);
					sectionData.content = sectionContent;
				} catch (error) {
					console.error(`Error loading section ${section.collection}:${section.item}`, error);
					sectionData.content = null;
				}
				
				sectionsWithData.push(sectionData);
			}
		}

		return {
			program: {
				...program,
				sectionsWithData
			}
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			program: null
		};
	}
};