<script>
let { data } = $props();
</script>

{#if data.organization}
	<div class="container mx-auto px-4 py-8">
		<div class="grid md:grid-cols-3 gap-8">
			<div class="md:col-span-1">
				{#if data.organization.logo}
					<div class="w-full max-w-sm mx-auto mb-6">
						<img 
							src="{data.organization.logo.filename_disk ? `/assets/${data.organization.logo.filename_disk}` : '#'}" 
							alt="{data.organization.name} logo"
							class="w-full rounded-lg shadow-lg"
						/>
					</div>
				{/if}

				{#if data.organization.website}
					<a href={data.organization.website} target="_blank" rel="noopener noreferrer" 
					   class="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mb-4">
						Visit Website
					</a>
				{/if}

				{#if data.organization.tags && data.organization.tags.length > 0}
					<div class="mb-4">
						<h3 class="font-semibold mb-2">Tags</h3>
						<div class="flex flex-wrap gap-2">
							{#each data.organization.tags as tag}
								<span class="px-3 py-1 text-sm rounded-full" 
									  style="background-color: {tag.tags_id?.color || '#e5e7eb'}; color: {tag.tags_id?.color ? '#000' : '#374151'}">
									{tag.tags_id?.name || 'Tag'}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="md:col-span-2">
				<h1 class="text-4xl font-bold mb-6">{data.organization.name}</h1>

				{#if data.organization.organization_notes}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">About</h2>
						<div class="prose max-w-none">
							{@html data.organization.organization_notes}
						</div>
					</section>
				{/if}

				<div class="grid md:grid-cols-2 gap-6 mb-8">
					{#if data.organization.charity_status || data.organization.annual_revenue || data.organization.number_of_employees}
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-800 mb-3">Organization Details</h3>
							<div class="space-y-2 text-sm">
								{#if data.organization.charity_status}
									<p><strong>Status:</strong> {data.organization.charity_status.replace('_', ' ').toUpperCase()}</p>
								{/if}
								{#if data.organization.annual_revenue}
									<p><strong>Annual Revenue:</strong> {data.organization.annual_revenue}</p>
								{/if}
								{#if data.organization.number_of_employees}
									<p><strong>Employees:</strong> {data.organization.number_of_employees}</p>
								{/if}
								<p><strong>Active:</strong> {data.organization.is_active ? 'Yes' : 'No'}</p>
							</div>
						</div>
					{/if}
				</div>

				{#if data.organization.festivals && data.organization.festivals.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Festivals</h2>
						<div class="grid gap-3">
							{#each data.organization.festivals as festival}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/festivals/{festival.festivals_id?.id || festival.festivals_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{festival.festivals_id?.title || 'Unknown Festival'}
										</a>
									</h3>
									{#if festival.festivals_id?.year}
										<p class="text-sm text-gray-600">{festival.festivals_id.year}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.organization.productions && data.organization.productions.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Productions</h2>
						<div class="grid gap-3">
							{#each data.organization.productions as production}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/productions/{production.productions_id?.id || production.productions_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{production.productions_id?.title || 'Unknown Production'}
										</a>
									</h3>
									{#if production.productions_id?.opening_date}
										<p class="text-sm text-gray-600">Opens: {new Date(production.productions_id.opening_date).toLocaleDateString()}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.organization.sponsoring && data.organization.sponsoring.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Sponsorships</h2>
						<div class="grid gap-3">
							{#each data.organization.sponsoring as sponsor}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/programs/{sponsor.programs_id?.id || sponsor.programs_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{sponsor.programs_id?.title || 'Unknown Program'}
										</a>
									</h3>
									{#if sponsor.sponsor_level}
										<p class="text-sm text-gray-600">{sponsor.sponsor_level.replace('_', ' ').toUpperCase()} Sponsor</p>
									{/if}
									{#if sponsor.thank_you_message}
										<p class="text-sm text-gray-700 mt-1">{sponsor.thank_you_message}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</div>

		<footer class="mt-8 pt-4 border-t text-sm text-gray-500">
			<p>Status: {data.organization.status}</p>
		</footer>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600">Organization not found</h1>
		<p class="mt-4"><a href="/organizations" class="text-blue-600 hover:underline">← Back to organizations</a></p>
	</div>
{/if}