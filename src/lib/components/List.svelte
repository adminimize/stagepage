<script>
let { 
	items = [],
	title = '',
	sortKey = 'name',
	linkPrefix = '',
	linkKey = 'id'
} = $props();

// Sort items alphabetically by the specified key
let sortedItems = $derived(
	[...items].sort((a, b) => {
		const aVal = a[sortKey] || '';
		const bVal = b[sortKey] || '';
		return aVal.localeCompare(bVal);
	})
);

function getDisplayName(item) {
	return item.stage_name || item.full_name || item.title || item.name || 'Untitled';
}

function getItemLink(item) {
	return `${linkPrefix}/${item[linkKey]}`;
}
</script>

<div class="bg-white rounded-lg shadow-sm">
	{#if title}
		<header class="px-6 py-4 border-b border-gray-200">
			<h1 class="text-2xl font-medium">{title}</h1>
		</header>
	{/if}
	
	<div class="p-6">
		{#if sortedItems.length > 0}
			<ul class="space-y-3">
				{#each sortedItems as item}
					<li class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<h3 class="font-medium">
									<a href={getItemLink(item)} class="text-blue-600 hover:text-blue-800 hover:underline">
										{getDisplayName(item)}
									</a>
								</h3>
								
								{#if item.tagline}
									<p class="text-sm text-gray-600 mt-1">{item.tagline}</p>
								{:else if item.description}
									<p class="text-sm text-gray-600 mt-1">{item.description.substring(0, 120)}...</p>
								{:else if item.default_bio}
									<p class="text-sm text-gray-600 mt-1">{item.default_bio.substring(0, 120)}...</p>
								{:else if item.subtitle}
									<p class="text-sm text-gray-600 mt-1">{item.subtitle}</p>
								{/if}
								
								<div class="flex gap-4 mt-2 text-xs text-gray-500">
									{#if item.year}
										<span>{item.year}</span>
									{/if}
									{#if item.location}
										<span>{item.location}</span>
									{/if}
									{#if item.venue}
										<span>{item.venue}</span>
									{/if}
									{#if item.capacity}
										<span>Capacity: {item.capacity.toLocaleString()}</span>
									{/if}
									{#if item.opening_date}
										<span>{new Date(item.opening_date).toLocaleDateString()}</span>
									{/if}
									{#if item.published_date}
										<span>Published: {new Date(item.published_date).toLocaleDateString()}</span>
									{/if}
									{#if item.start}
										<span>{new Date(item.start).toLocaleDateString()}</span>
									{/if}
									{#if item.genre}
										<span>{item.genre.replace('_', ' ')}</span>
									{/if}
									{#if item.venue_type}
										<span>{item.venue_type.replace('_', ' ')}</span>
									{/if}
								</div>
							</div>
							
							{#if item.status}
								<span class="text-xs px-2 py-1 rounded {item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
									{item.status}
								</span>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">No items found.</p>
			</div>
		{/if}
	</div>
</div>