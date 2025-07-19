<script>
let { data } = $props();
</script>

{#if data.venue}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold mb-6">{data.venue.name}</h1>

		<div class="grid md:grid-cols-3 gap-8">
			<div class="md:col-span-2">
				{#if data.venue.events && data.venue.events.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Upcoming Events</h2>
						<div class="grid gap-4">
							{#each data.venue.events as event}
								<div class="border rounded-lg p-4">
									<h3 class="text-lg font-medium">{event.events_id?.title || 'Event'}</h3>
									{#if event.events_id?.start}
										<p class="text-gray-600">
											{new Date(event.events_id.start).toLocaleString()}
										</p>
									{/if}
									{#if event.events_id?.special_notes}
										<p class="text-gray-700 mt-2">{event.events_id.special_notes}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			<div class="space-y-6">
				{#if data.venue.venue_type}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Venue Type</h3>
						<p>{data.venue.venue_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
					</div>
				{/if}

				{#if data.venue.capacity}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Capacity</h3>
						<p class="text-2xl font-bold text-blue-600">{data.venue.capacity.toLocaleString()}</p>
					</div>
				{/if}

				{#if data.venue.address}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-2">Address</h3>
						<div class="space-y-1">
							<p>{data.venue.address.street_address}</p>
							{#if data.venue.address.line_2}
								<p>{data.venue.address.line_2}</p>
							{/if}
							{#if data.venue.address.city}
								<p>{data.venue.address.city.name}, {data.venue.address.city.province}</p>
							{/if}
							<p>{data.venue.address.postal_code}</p>
							{#if data.venue.address.country}
								<p>{data.venue.address.country === 'CA' ? 'Canada' : data.venue.address.country}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600">Venue not found</h1>
		<p class="mt-4"><a href="/venues" class="text-blue-600 hover:underline">← Back to venues</a></p>
	</div>
{/if}