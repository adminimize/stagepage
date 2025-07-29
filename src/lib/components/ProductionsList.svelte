<script>
import { groupBy } from '$lib/utils';

let { 
	productions = [], 
	groupByFestival = false,
	showDates = true,
	showVenue = true,
	showDescription = true,
	showOrganizations = true
} = $props();

// Group productions by festival if requested
let groupedProductions = $derived(
	groupByFestival 
		? groupBy(productions, (p) => p.festivals?.[0]?.festivals_id?.id || 'no-festival')
		: { 'all': productions }
);

// Sort productions by date within each group
function sortProductionsByDate(productions) {
	return [...productions].sort((a, b) => {
		const dateA = new Date(a.opening_date || 0);
		const dateB = new Date(b.opening_date || 0);
		return dateB.getTime() - dateA.getTime();
	});
}
</script>

<div class="productions-list">
	{#each Object.entries(groupedProductions) as [groupKey, groupProductions]}
		{#if groupByFestival && groupKey !== 'all'}
			{@const festival = productions.find(p => p.festivals?.[0]?.festivals_id?.id === groupKey)?.festivals?.[0]?.festivals_id}
			{#if festival || groupKey === 'no-festival'}
				<section class="festival-group mb-8">
					{#if festival}
						<h3 class="text-2xl font-semibold mb-4">
							<a href="/festivals/{festival.id}" class="text-blue-600 hover:text-blue-800 hover:underline">
								{festival.title || 'Untitled Festival'}
							</a>
							{#if festival.year}
								<span class="text-gray-600 text-lg ml-2">({festival.year})</span>
							{/if}
						</h3>
					{:else}
						<h3 class="text-2xl font-semibold mb-4 text-gray-600">
							Independent Productions
						</h3>
					{/if}
					<div class="grid gap-4">
						{#each sortProductionsByDate(groupProductions) as production}
							{@render productionCard(production)}
						{/each}
					</div>
				</section>
			{/if}
		{:else}
			<div class="grid gap-4">
				{#each sortProductionsByDate(groupProductions) as production}
					{@render productionCard(production)}
				{/each}
			</div>
		{/if}
	{/each}
</div>

{#snippet productionCard(production)}
	<article class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
		<header class="mb-2">
			<h3 class="text-lg font-medium">
				<a href="/productions/{production.id}" 
				   class="text-blue-600 hover:text-blue-800 hover:underline">
					{production.title || 'Untitled Production'}
				</a>
			</h3>
			
			{#if showDates && (production.opening_date || production.closing_date)}
				<div class="text-sm text-gray-600 mt-1">
					{#if production.opening_date && production.closing_date}
						{new Date(production.opening_date).toLocaleDateString()} - {new Date(production.closing_date).toLocaleDateString()}
					{:else if production.opening_date}
						Opens: {new Date(production.opening_date).toLocaleDateString()}
					{:else if production.closing_date}
						Closes: {new Date(production.closing_date).toLocaleDateString()}
					{/if}
				</div>
			{/if}
			
			{#if showVenue && production.venue}
				<div class="text-sm text-gray-600">
					📍 {production.venue}
				</div>
			{/if}
		</header>
		
		{#if showDescription && production.description}
			<p class="text-gray-700 mt-2">{production.description}</p>
		{/if}
		
		{#if showOrganizations && production.organizations && production.organizations.length > 0}
			<div class="mt-2">
				<span class="text-sm text-gray-600">Presented by: </span>
				{#each production.organizations as org, index}
					{#if org.organizations_id}
						<a href="/organizations/{org.organizations_id.id || org.organizations_id}" 
						   class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
							{org.organizations_id.name || 'Unknown Organization'}
						</a>
						{#if index < production.organizations.length - 1}
							<span class="text-sm text-gray-600">, </span>
						{/if}
					{/if}
				{/each}
			</div>
		{/if}
		
		{#if production.show && production.show.length > 0}
			<div class="mt-2">
				{#each production.show as show}
					{#if show.shows_id}
						<a href="/shows/{show.shows_id.id || show.shows_id}" 
						   class="text-sm text-gray-500 hover:text-gray-700 hover:underline">
							View Show Details →
						</a>
					{/if}
				{/each}
			</div>
		{/if}
	</article>
{/snippet}

