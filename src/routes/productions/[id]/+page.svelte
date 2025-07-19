<script>
let { data } = $props();
</script>

{#if data.production}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold mb-4">{data.production.title}</h1>
		
		{#if data.production.description}
			<p class="text-xl text-gray-600 mb-6">{data.production.description}</p>
		{/if}

		<div class="grid md:grid-cols-3 gap-8 mb-8">
			<div class="md:col-span-2">
				{#if data.production.show && data.production.show.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Show Information</h2>
						<div class="grid gap-4">
							{#each data.production.show as show}
								<div class="border rounded-lg p-4">
									<h3 class="text-lg font-medium">
										<a href="/shows/{show.shows_id?.id || show.shows_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{show.shows_id?.title || 'Untitled Show'}
										</a>
									</h3>
									{#if show.shows_id?.description}
										<p class="text-gray-600 mt-2">{show.shows_id.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.production.programs && data.production.programs.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Programs</h2>
						<div class="grid gap-4">
							{#each data.production.programs as program}
								<div class="border rounded-lg p-4">
									<h3 class="text-lg font-medium">
										<a href="/programs/{program.id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{program.title}
										</a>
									</h3>
									{#if program.published_date}
										<p class="text-sm text-gray-600">Published: {new Date(program.published_date).toLocaleDateString()}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.production.credits && data.production.credits.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Cast & Crew</h2>
						<div class="grid gap-3">
							{#each data.production.credits as credit}
								<div class="border rounded-lg p-3">
									<div class="flex justify-between items-start">
										<div>
											<h4 class="font-medium">
												<a href="/people/{credit.people_id?.id || credit.people_id}" 
												   class="text-blue-600 hover:text-blue-800 hover:underline">
													{credit.people_id?.stage_name || credit.people_id?.full_name || 'Unknown Person'}
												</a>
											</h4>
											{#if credit.role}
												<p class="text-sm text-gray-600">{credit.role.name}</p>
											{/if}
										</div>
									</div>
									{#if credit.bio_override}
										<p class="text-sm text-gray-700 mt-2">{credit.bio_override}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.production.organizations && data.production.organizations.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Producing Organizations</h2>
						<div class="grid gap-3">
							{#each data.production.organizations as org}
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
				{#if data.production.venue}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Venue</h3>
						<p>{data.production.venue}</p>
					</div>
				{/if}

				{#if data.production.opening_date || data.production.closing_date}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Run Dates</h3>
						{#if data.production.opening_date && data.production.closing_date}
							<p><strong>Opens:</strong> {new Date(data.production.opening_date).toLocaleDateString()}</p>
							<p><strong>Closes:</strong> {new Date(data.production.closing_date).toLocaleDateString()}</p>
						{:else if data.production.opening_date}
							<p><strong>Opens:</strong> {new Date(data.production.opening_date).toLocaleDateString()}</p>
						{:else if data.production.closing_date}
							<p><strong>Closes:</strong> {new Date(data.production.closing_date).toLocaleDateString()}</p>
						{/if}
					</div>
				{/if}

				{#if data.production.festivals && data.production.festivals.length > 0}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Festivals</h3>
						<div class="space-y-2">
							{#each data.production.festivals as festival}
								<a href="/festivals/{festival.festivals_id?.id || festival.festivals_id}" 
								   class="block text-blue-600 hover:text-blue-800 hover:underline">
									{festival.festivals_id?.title || 'Unknown Festival'}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<footer class="mt-8 pt-4 border-t text-sm text-gray-500">
			<p>Status: {data.production.status}</p>
			{#if data.production.slug}
				<p>Slug: {data.production.slug}</p>
			{/if}
		</footer>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600">Production not found</h1>
		<p class="mt-4"><a href="/productions" class="text-blue-600 hover:underline">← Back to productions</a></p>
	</div>
{/if}