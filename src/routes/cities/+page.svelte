<script>
let { data } = $props();

const countryNames = {
	'CA': 'Canada',
	'US': 'United States'
};

const provinceNames = {
	'AB': 'Alberta',
	'BC': 'British Columbia',
	'MB': 'Manitoba',
	'NB': 'New Brunswick',
	'NL': 'Newfoundland and Labrador',
	'NT': 'Northwest Territories',
	'NS': 'Nova Scotia',
	'NU': 'Nunavut',
	'ON': 'Ontario',
	'PE': 'Prince Edward Island',
	'QC': 'Quebec',
	'SK': 'Saskatchewan',
	'YT': 'Yukon'
};
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-8">Cities</h1>

	{#each Object.entries(data.groupedCities) as [country, provinces]}
		<section class="mb-12">
			<h2 class="text-3xl font-semibold mb-6">{countryNames[country] || country}</h2>
			
			{#each Object.entries(provinces) as [province, cities]}
				<div class="mb-8">
					<h3 class="text-xl font-medium mb-4 text-gray-700">
						{provinceNames[province] || province}
					</h3>
					
					<div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
						{#each cities as city}
							<a href="/cities/{encodeURIComponent(city.name)}/productions" 
							   class="block p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
								<span class="text-lg font-medium text-blue-600 hover:text-blue-800">
									{city.name}
								</span>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</section>
	{/each}

	{#if Object.keys(data.groupedCities).length === 0}
		<p class="text-gray-500 text-center py-8">No cities found.</p>
	{/if}
</div>