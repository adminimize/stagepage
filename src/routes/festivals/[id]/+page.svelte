<script>
let { data } = $props();
</script>

{#if data.festival}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold mb-4">{data.festival.title}</h1>
		
		{#if data.festival.tagline}
			<p class="text-xl text-gray-600 mb-6">{data.festival.tagline}</p>
		{/if}

		<div class="grid md:grid-cols-3 gap-8 mb-8">
			<div class="md:col-span-2">
				{#if data.festival.description}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">About</h2>
						<div class="prose max-w-none">
							{@html data.festival.description}
						</div>
					</section>
				{/if}

				{#if data.festival.productions && data.festival.productions.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Productions</h2>
						<div class="grid gap-4">
							{#each data.festival.productions as production}
								<div class="border rounded-lg p-4">
									<h3 class="text-lg font-medium">
										<a href="/productions/{production.productions_id?.id || production.productions_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{production.productions_id?.title || 'Untitled Production'}
										</a>
									</h3>
									{#if production.productions_id?.description}
										<p class="text-gray-600 mt-2">{production.productions_id.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.festival.organizations && data.festival.organizations.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Partner Organizations</h2>
						<div class="grid gap-3">
							{#each data.festival.organizations as org}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/organizations/{org.organizations_id?.id || org.organizations_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{org.organizations_id?.name || 'Unknown Organization'}
										</a>
									</h3>
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			<div class="space-y-6">
				{#if data.festival.year}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Year</h3>
						<p class="text-2xl font-bold text-blue-600">{data.festival.year}</p>
					</div>
				{/if}

				{#if data.festival.location}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Location</h3>
						<p>{data.festival.location}</p>
					</div>
				{/if}

				{#if data.festival.start_date || data.festival.end_date}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Dates</h3>
						{#if data.festival.start_date && data.festival.end_date}
							<p>{new Date(data.festival.start_date).toLocaleDateString()}</p>
							<p class="text-gray-600">to</p>
							<p>{new Date(data.festival.end_date).toLocaleDateString()}</p>
						{:else if data.festival.start_date}
							<p>Starts: {new Date(data.festival.start_date).toLocaleDateString()}</p>
						{:else if data.festival.end_date}
							<p>Ends: {new Date(data.festival.end_date).toLocaleDateString()}</p>
						{/if}
					</div>
				{/if}

				{#if data.festival.website}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Website</h3>
						<a href={data.festival.website} target="_blank" rel="noopener noreferrer" 
						   class="text-blue-600 hover:text-blue-800 hover:underline break-all">
							{data.festival.website}
						</a>
					</div>
				{/if}
			</div>
		</div>

		<footer class="mt-8 pt-4 border-t text-sm text-gray-500">
			<p>Status: {data.festival.status}</p>
			{#if data.festival.slug}
				<p>Slug: {data.festival.slug}</p>
			{/if}
		</footer>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600">Festival not found</h1>
		<p class="mt-4"><a href="/festivals" class="text-blue-600 hover:underline">← Back to festivals</a></p>
	</div>
{/if}