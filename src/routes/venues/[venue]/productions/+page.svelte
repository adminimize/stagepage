<script>
import ProductionsList from '$lib/components/ProductionsList.svelte';

let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-4xl font-bold mb-4">Productions at {data.venue}</h1>
		
		{#if data.years && data.years.length > 0}
			<div class="mb-6">
				<span class="text-gray-600 mr-2">Years:</span>
				{#each data.years as year, index}
					<a href="/years/{year}" 
					   class="text-blue-600 hover:underline">
						{year}
					</a>
					{#if index < data.years.length - 1}
						<span class="mx-1">•</span>
					{/if}
				{/each}
			</div>
		{/if}
		
		<nav class="text-sm text-gray-600">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-2">/</span>
			<a href="/venues" class="hover:underline">Venues</a>
			<span class="mx-2">/</span>
			<span>{data.venue}</span>
		</nav>
	</header>

	{#if data.productions && data.productions.length > 0}
		<ProductionsList 
			productions={data.productions} 
			groupByFestival={false}
			showDates={true}
			showVenue={false}
			showDescription={true}
			showOrganizations={true}
		/>
		
		<div class="mt-8 text-center">
			<p class="text-gray-600">
				{data.productions.length} production{data.productions.length !== 1 ? 's' : ''} found at this venue
			</p>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600 text-lg">No productions found at {data.venue}.</p>
			<a href="/productions" class="mt-4 inline-block text-blue-600 hover:underline">
				Browse all productions →
			</a>
		</div>
	{/if}
</div>