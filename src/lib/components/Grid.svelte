<script>
let { 
	items = [],
	title = '',
	sortKey = 'name',
	linkPrefix = '',
	linkKey = 'id',
	columns = 'md:grid-cols-2 lg:grid-cols-3'
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
			<div class="grid gap-6 {columns}">
				{#each sortedItems as item}
					<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
						{#if item.headshot?.filename_disk || item.logo?.filename_disk}
							<div class="w-full h-32 mb-4 overflow-hidden rounded bg-gray-100">
								<img 
									src="/assets/{item.headshot?.filename_disk || item.logo?.filename_disk}" 
									alt="{getDisplayName(item)}"
									class="w-full h-full object-cover"
								/>
							</div>
						{:else if item.headshot !== undefined}
							<div class="w-full h-32 mb-4 overflow-hidden rounded bg-gray-100">
								<img 
									src="https://placehold.co/300x200?text={encodeURIComponent(getDisplayName(item))}" 
									alt="{getDisplayName(item)} placeholder"
									class="w-full h-full object-cover"
								/>
							</div>
						{/if}
						
						<h3 class="font-medium mb-2">
							<a href={getItemLink(item)} class="text-blue-600 hover:text-blue-800 hover:underline">
								{getDisplayName(item)}
							</a>
						</h3>
						
						{#if item.tagline}
							<p class="text-sm text-gray-600 mb-3">{item.tagline}</p>
						{:else if item.description}
							<p class="text-sm text-gray-600 mb-3">{item.description.substring(0, 100)}...</p>
						{:else if item.default_bio}
							<p class="text-sm text-gray-600 mb-3">{item.default_bio.substring(0, 100)}...</p>
						{:else if item.subtitle}
							<p class="text-sm text-gray-600 mb-3">{item.subtitle}</p>
						{/if}
						
						<div class="text-xs text-gray-500 space-y-1">
							{#if item.year}
								<p>{item.year}</p>
							{/if}
							{#if item.location}
								<p>{item.location}</p>
							{/if}
							{#if item.venue}
								<p>{item.venue}</p>
							{/if}
							{#if item.capacity}
								<p>Capacity: {item.capacity.toLocaleString()}</p>
							{/if}
							{#if item.opening_date}
								<p>{new Date(item.opening_date).toLocaleDateString()}</p>
							{/if}
							{#if item.published_date}
								<p>Published: {new Date(item.published_date).toLocaleDateString()}</p>
							{/if}
							{#if item.start}
								<p>{new Date(item.start).toLocaleDateString()}</p>
							{/if}
							{#if item.genre}
								<p>{item.genre.replace('_', ' ')}</p>
							{/if}
							{#if item.venue_type}
								<p>{item.venue_type.replace('_', ' ')}</p>
							{/if}
						</div>
						
						{#if item.status}
							<div class="mt-3">
								<span class="text-xs px-2 py-1 rounded {item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
									{item.status}
								</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500">No items found.</p>
			</div>
		{/if}
	</div>
</div>