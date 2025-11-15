<script>
import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

// Props
let { 
	program,
	embedded = false,
	maxDepth = 3,
	currentDepth = 0
} = $props();

// Helper functions
function getSectionDisplayName(collection) {
	const map = {
		'section_cover': 'Cover',
		'section_notes': 'Content',
		'section_credits': 'Credits',
		'section_bios': 'Artist Biographies',
		'section_songs': 'Musical Numbers',
		'section_sponsors': 'Sponsors',
		'section_special_thanks': 'Special Thanks',
		'section_staff': 'Staff',
		'section_photos': 'Photos',
		'section_ads': 'Advertisements',
		'programs': 'Embedded Program'
	};
	return map[collection] || collection.replace('section_', '').replace('_', ' ');
}

function formatSponsorLevel(level) {
	if (!level) return '';
	return level.replace('_', ' ').split(' ').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1)
	).join(' ');
}

// Reactive state for embedded programs
let embeddedPrograms = $state({});

// Function to load embedded program data
async function loadEmbeddedProgram(programId) {
	if (embeddedPrograms[programId] || currentDepth >= maxDepth) return;
	
	try {
		const directus = await createDirectusClient();
		const embeddedProgram = await directus.request(
			readItem('programs', programId, {
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

		// Fetch detailed section data
		const sectionsWithData = [];
		if (embeddedProgram.sections) {
			for (const section of embeddedProgram.sections) {
				let sectionData = { ...section };
				try {
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

		embeddedPrograms[programId] = {
			...embeddedProgram,
			sectionsWithData
		};
	} catch (error) {
		console.error('Error loading embedded program:', error);
		embeddedPrograms[programId] = null;
	}
}
</script>

{#if program}
	<div class="{embedded ? 'border-l-4 border-blue-500 dark:border-blue-400 pl-6 ml-4' : ''} program-wrapper">
		<!-- Program Header -->
		<header class="{embedded ? 'mb-6' : 'mb-8'} {embedded ? '' : 'text-center'}">
			<h1 class="{embedded ? 'text-3xl' : 'text-5xl'} font-bold mb-4 text-gray-900 dark:text-gray-100">
				{program.title}
			</h1>

			{#if program.published_date}
				<p class="text-gray-600 dark:text-gray-400 mb-4">Published: {new Date(program.published_date).toLocaleDateString()}</p>
			{/if}

			{#if !embedded}
				<div class="flex flex-wrap justify-center gap-4 text-sm">
					{#if program.production}
						<span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full">
							Production: <a href="/productions/{program.production.id}" class="underline font-medium hover:text-blue-600 dark:hover:text-blue-300">{program.production.title}</a>
						</span>
					{/if}

					{#if program.festival && program.festival.length > 0}
						{#each program.festival as fest}
							<span class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full">
								Festival: <a href="/festivals/{fest.festivals_id?.id || fest.festivals_id}" class="underline font-medium hover:text-purple-600 dark:hover:text-purple-300">{fest.festivals_id?.title || 'Festival'}</a>
							</span>
						{/each}
					{/if}
				</div>
			{/if}
		</header>

		<!-- Program Sections -->
		{#if program.sectionsWithData && program.sectionsWithData.length > 0}
			<div class="space-y-{embedded ? '8' : '12'}">
				{#each program.sectionsWithData as section}
					<section class="program-section">
						<!-- Handle embedded programs section -->
						{#if section.collection === 'programs' && section.content}
							<div class="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
								<h2 class="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300 border-b border-blue-300 dark:border-blue-700 pb-2">
									{section.content.title}
								</h2>
								
								<!-- Check if we should load and display the embedded program -->
								{#if currentDepth < maxDepth}
									{#await loadEmbeddedProgram(section.content.id)}
										<div class="text-center py-8">
											<div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
											<p class="text-blue-600 dark:text-blue-400 mt-2">Loading embedded program...</p>
										</div>
									{:then}
										{#if embeddedPrograms[section.content.id]}
											<!-- Recursively render the embedded program -->
											<svelte:self
												program={embeddedPrograms[section.content.id]}
												embedded={true}
												maxDepth={maxDepth}
												currentDepth={currentDepth + 1}
											/>
										{:else}
											<div class="text-center py-4 text-gray-600 dark:text-gray-400">
												<p>Could not load embedded program</p>
											</div>
										{/if}
									{:catch error}
										<div class="text-center py-4 text-red-600 dark:text-red-400">
											<p>Error loading embedded program: {error.message}</p>
										</div>
									{/await}
								{:else}
									<div class="text-center py-4 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded">
										<p class="font-medium">Maximum nesting depth reached</p>
										<a href="/programs/{section.content.id}" class="text-blue-600 dark:text-blue-400 hover:underline">
											View "{section.content.title}" separately →
										</a>
									</div>
								{/if}
							</div>

						<!-- All other section types (same as before) -->
						{:else if section.collection === 'section_cover' && section.content}
							<div class="relative mb-12">
								<div class="w-full h-96 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
									{#if section.content.image}
										<img 
											src="/assets/{section.content.image.filename_disk}" 
											alt="Program cover"
											class="w-full h-full object-cover"
										/>
									{:else}
										<img 
											src="https://placehold.co/800x400?text={encodeURIComponent(program.title)}" 
											alt="Program cover placeholder"
											class="w-full h-full object-cover opacity-60"
										/>
									{/if}
									<div class="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8">
										<h1 class="text-6xl font-bold mb-4 drop-shadow-lg">{section.content.title || program.title}</h1>
										{#if section.content.subtitle}
											<p class="text-2xl mb-6 drop-shadow-md">{section.content.subtitle}</p>
										{/if}
									</div>
								</div>
							</div>

						{:else if section.collection === 'section_credits' && section.content}
							<div class="mb-12">
								<h2 class="text-3xl font-bold mb-8 text-center border-b-2 border-gray-200 dark:border-gray-700 pb-4 text-gray-900 dark:text-gray-100">
									{section.content.title || 'Cast & Creative Team'}
								</h2>

								{#if program.credits && program.credits.length > 0}
									<div class="grid gap-4 {section.content.columns === 1 ? 'grid-cols-1' : section.content.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}">
										{#each program.credits as credit}
											<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
												<h4 class="font-semibold text-lg">
													<a href="/people/{credit.people_id?.id || credit.people_id}"
													   class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
														{credit.people_id?.stage_name || credit.people_id?.full_name || 'Unknown Person'}
													</a>
												</h4>
												{#if credit.role}
													<p class="text-gray-600 dark:text-gray-400 font-medium">{credit.role.name}</p>
												{/if}
												{#if credit.bio_override}
													<p class="text-sm text-gray-700 dark:text-gray-300 mt-2">{credit.bio_override}</p>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>

						<!-- Basic fallback for other section types -->
						{:else}
							<div class="mb-8 p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
								<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
									{getSectionDisplayName(section.collection)}
								</h3>
								<p class="text-gray-700 dark:text-gray-300 text-sm">Section type: {section.collection}</p>
								{#if section.content && section.content.title}
									<p class="text-gray-800 dark:text-gray-200 font-medium mt-2">{section.content.title}</p>
								{/if}
							</div>
						{/if}
					</section>
				{/each}
			</div>
		{/if}

		<!-- Production Credits (if no sections but has credits) -->
		{#if (!program.sectionsWithData || program.sectionsWithData.length === 0) && program.production?.credits && program.production.credits.length > 0}
			<div class="mt-8">
				<h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Cast & Crew</h2>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each program.production.credits as credit}
						<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
							<h4 class="font-semibold">
								<a href="/people/{credit.people_id?.id || credit.people_id}"
								   class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
									{credit.people_id?.stage_name || credit.people_id?.full_name || 'Unknown Person'}
								</a>
							</h4>
							{#if credit.role}
								<p class="text-gray-600 dark:text-gray-400 text-sm">{credit.role.name}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Production Description -->
		{#if program.production?.description}
			<div class="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">About this Production</h3>
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed">{program.production.description}</p>

				{#if program.production.venue || program.production.opening_date}
					<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
						{#if program.production.venue}
							<p>Venue: {program.production.venue}</p>
						{/if}
						{#if program.production.opening_date && program.production.closing_date}
							<p>Dates: {new Date(program.production.opening_date).toLocaleDateString()} - {new Date(program.production.closing_date).toLocaleDateString()}</p>
						{:else if program.production.opening_date}
							<p>Date: {new Date(program.production.opening_date).toLocaleDateString()}</p>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.program-wrapper {
		break-inside: avoid;
	}
	
	@media print {
		.program-wrapper {
			page-break-inside: avoid;
		}
	}
</style>