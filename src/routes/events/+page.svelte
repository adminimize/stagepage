<script>
let { data } = $props();

function formatEventTime(start, end) {
	const startDate = new Date(start);
	const endDate = end ? new Date(end) : null;
	
	const dateStr = startDate.toLocaleDateString();
	const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	
	if (endDate) {
		const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		if (startDate.toDateString() === endDate.toDateString()) {
			return `${dateStr}, ${startTime} - ${endTime}`;
		} else {
			return `${dateStr} ${startTime} - ${endDate.toLocaleDateString()} ${endTime}`;
		}
	}
	
	return `${dateStr}, ${startTime}`;
}

function isUpcoming(eventDate) {
	return new Date(eventDate) > new Date();
}

function isPast(eventDate) {
	return new Date(eventDate) < new Date();
}

// Group events by status
let upcomingEvents = $derived(data.events.filter(event => isUpcoming(event.start)));
let pastEvents = $derived(data.events.filter(event => isPast(event.start)));
</script>

<div class="space-y-8">
	<header>
		<h1 class="text-3xl font-bold mb-2">Events</h1>
		<p class="text-gray-600">Performance schedules and special events</p>
	</header>

	<!-- Upcoming Events -->
	{#if upcomingEvents.length > 0}
		<section class="bg-white rounded-lg shadow-sm p-6">
			<h2 class="text-2xl font-semibold mb-6 text-green-700">Upcoming Events</h2>
			<div class="grid gap-4 md:grid-cols-2">
				{#each upcomingEvents as event}
					<div class="border border-green-200 rounded-lg p-4 bg-green-50 hover:shadow-md transition-shadow">
						<h3 class="font-semibold text-lg mb-2">
							<a href="/events/{event.id}" class="text-blue-600 hover:text-blue-800 hover:underline">
								{event.title || 'Event'}
							</a>
						</h3>
						
						<div class="space-y-2 text-sm">
							<p class="text-green-700 font-medium">
								{formatEventTime(event.start, event.end)}
							</p>
							
							{#if event.venue && event.venue.length > 0}
								<p class="text-gray-600">
									{event.venue.map(v => v.venues_id?.name || 'Venue').join(', ')}
								</p>
							{/if}
							
							{#if event.program && event.program.length > 0}
								<p class="text-gray-600">
									{event.program.map(p => p.programs_id?.title || 'Program').join(', ')}
								</p>
							{/if}
							
							{#if event.special_notes}
								<p class="text-gray-700 text-xs mt-2 italic">{event.special_notes}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Past Events -->
	{#if pastEvents.length > 0}
		<section class="bg-white rounded-lg shadow-sm p-6">
			<h2 class="text-2xl font-semibold mb-6 text-gray-600">Past Events</h2>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each pastEvents as event}
					<div class="border rounded-lg p-4 hover:shadow-md transition-shadow opacity-75 hover:opacity-100">
						<h3 class="font-semibold mb-2">
							<a href="/events/{event.id}" class="text-blue-600 hover:text-blue-800 hover:underline">
								{event.title || 'Event'}
							</a>
						</h3>
						
						<div class="space-y-1 text-sm text-gray-600">
							<p>
								{formatEventTime(event.start, event.end)}
							</p>
							
							{#if event.venue && event.venue.length > 0}
								<p>
									{event.venue.map(v => v.venues_id?.name || 'Venue').join(', ')}
								</p>
							{/if}
							
							{#if event.special_notes}
								<p class="text-xs mt-2 italic">{event.special_notes}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if data.events.length === 0}
		<div class="bg-white rounded-lg shadow-sm p-12 text-center">
			<h2 class="text-xl font-semibold text-gray-600 mb-2">No events found</h2>
			<p class="text-gray-500">Check back later for upcoming performances and events.</p>
		</div>
	{/if}
</div>