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
	}, {});

	const sortedDecades = Object.entries(decades).sort(([a], [b]) => Number(b) - Number(a));
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Browse by Year</h1>

	{#each sortedDecades as [decade, years]}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-semibold">{decade}s</h2>

			<div class="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-10">
				{#each years as yearData}
					<a
						href="/years/{yearData.year}"
						class="block rounded-lg border p-4 text-center transition-all hover:border-blue-500 hover:shadow-md"
					>
						<div class="text-xl font-bold text-blue-600 hover:text-blue-800">
							{yearData.year}
						</div>
						<div class="mt-1 text-xs text-gray-500">
							{yearData.total}
							{yearData.total === 1 ? 'item' : 'items'}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/each}

	{#if data.years.length === 0}
		<p class="py-8 text-center text-gray-500">No years with productions found.</p>
	{/if}
</div>
