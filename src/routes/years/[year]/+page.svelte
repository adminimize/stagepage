<script>
import ProductionsList from '$lib/components/ProductionsList.svelte';

let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-4xl font-bold mb-4">Productions from {data.year}</h1>
		
		{#if data.festivals && data.festivals.length > 0}
			<div class="mb-6">
				<h2 class="text-xl font-semibold mb-2">Festivals in {data.year}:</h2>
				<div class="flex flex-wrap gap-2">
					{#each data.festivals as festival}
						<a href="/festivals/{festival.id}" 
						   class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
							{festival.title}
						</a>
					{/each}
				</div>
			</div>
		{/if}
		
		<nav class="text-sm text-gray-600">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-2">/</span>
			<span>Year {data.year}</span>
		</nav>
	</header>

	{#if data.productions && data.productions.length > 0}
		<ProductionsList 
			productions={data.productions} 
			groupByFestival={true}
			showDates={true}
			showVenue={true}
			showDescription={true}
			showOrganizations={true}
		/>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600 text-lg">No productions found for {data.year}.</p>
			<div class="mt-4 space-x-4">
				<a href="/years/{data.year - 1}" 
				   class="text-blue-600 hover:underline">
					← {data.year - 1}
				</a>
				<a href="/years/{data.year + 1}" 
				   class="text-blue-600 hover:underline">
					{data.year + 1} →
				</a>
			</div>
		</div>
	{/if}
</div>