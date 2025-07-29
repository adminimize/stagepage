<script>
let { data } = $props();

// Group years by decade
const decades = data.years.reduce((acc, yearData) => {
	const decade = Math.floor(yearData.year / 10) * 10;
	if (!acc[decade]) {
		acc[decade] = [];
	}
	acc[decade].push(yearData);
	return acc;
}, {} as Record<number, typeof data.years>);

const sortedDecades = Object.entries(decades).sort(([a], [b]) => Number(b) - Number(a));
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-8">Browse by Year</h1>

	{#each sortedDecades as [decade, years]}
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-6">{decade}s</h2>
			
			<div class="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
				{#each years as yearData}
					<a href="/years/{yearData.year}" 
					   class="block p-4 text-center border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
						<div class="text-xl font-bold text-blue-600 hover:text-blue-800">
							{yearData.year}
						</div>
						<div class="text-xs text-gray-500 mt-1">
							{yearData.total} {yearData.total === 1 ? 'item' : 'items'}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/each}

	{#if data.years.length === 0}
		<p class="text-gray-500 text-center py-8">No years with productions found.</p>
	{/if}
</div>