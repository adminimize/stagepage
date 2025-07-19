<script>
let { data } = $props();

function formatEventTime(start, end) {
	const startDate = new Date(start);
	const endDate = end ? new Date(end) : null;
	
	const dateOptions = { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	};
	const timeOptions = { 
		hour: '2-digit', 
		minute: '2-digit', 
		hour12: true 
	};
	
	const dateStr = startDate.toLocaleDateString(undefined, dateOptions);
	const startTime = startDate.toLocaleTimeString(undefined, timeOptions);
	
	if (endDate) {
		const endTime = endDate.toLocaleTimeString(undefined, timeOptions);
		if (startDate.toDateString() === endDate.toDateString()) {
			return {
				date: dateStr,
				time: `${startTime} - ${endTime}`
			};
		} else {
			const endDateStr = endDate.toLocaleDateString(undefined, dateOptions);
			return {
				date: `${dateStr} - ${endDateStr}`,
				time: `${startTime} - ${endTime}`
			};
		}
	}
	
	return {
		date: dateStr,
		time: startTime
	};
}

function isUpcoming(eventDate) {
	return new Date(eventDate) > new Date();
}

function getDuration(start, end) {
	if (!end) return null;
	const diff = new Date(end) - new Date(start);
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	
	if (hours > 0) {
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	}
	return `${minutes}m`;
}

let eventTime = $derived(data.event ? formatEventTime(data.event.start, data.event.end) : null);
let upcoming = $derived(data.event ? isUpcoming(data.event.start) : false);
let duration = $derived(data.event ? getDuration(data.event.start, data.event.end) : null);
</script>

{#if data.event}
	<div class="bg-white rounded-lg shadow-sm">
		<!-- Event Header -->
		<header class="p-6 border-b border-gray-200">
			<div class="flex items-start justify-between mb-4">
				<div class="flex-1">
					<h1 class="text-4xl font-bold mb-2">{data.event.title || 'Event'}</h1>
					
					{#if upcoming}
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
							✨ Upcoming Event
						</span>
					{:else}
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
							🕰️ Past Event
						</span>
					{/if}
				</div>
			</div>
			
			{#if eventTime}
				<div class="grid md:grid-cols-2 gap-4 mb-4">
					<div class="bg-blue-50 rounded-lg p-4">
						<h3 class="font-semibold text-blue-800 mb-2">📅 Date</h3>
						<p class="text-blue-700">{eventTime.date}</p>
					</div>
					<div class="bg-blue-50 rounded-lg p-4">
						<h3 class="font-semibold text-blue-800 mb-2">⏰ Time</h3>
						<p class="text-blue-700">{eventTime.time}</p>
						{#if duration}
							<p class="text-blue-600 text-sm mt-1">Duration: {duration}</p>
						{/if}
					</div>
				</div>
			{/if}
		</header>

		<div class="p-6">
			<div class="grid lg:grid-cols-3 gap-8">
				<!-- Main Content -->
				<div class="lg:col-span-2 space-y-8">
					{#if data.event.special_notes}
						<section>
							<h2 class="text-2xl font-semibold mb-4">Event Details</h2>
							<div class="prose max-w-none bg-yellow-50 border border-yellow-200 rounded-lg p-4">
								<p class="text-yellow-800 font-medium">ℹ️ {data.event.special_notes}</p>
							</div>
						</section>
					{/if}

					{#if data.event.understudy_notes}
						<section>
							<h2 class="text-2xl font-semibold mb-4">Cast Changes</h2>
							<div class="prose max-w-none bg-orange-50 border border-orange-200 rounded-lg p-4">
								<p class="text-orange-800">{data.event.understudy_notes}</p>
							</div>
						</section>
					{/if}

					{#if data.event.program && data.event.program.length > 0}
						<section>
							<h2 class="text-2xl font-semibold mb-4">Programs</h2>
							<div class="grid gap-4">
								{#each data.event.program as program}
									<div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
										<h3 class="text-lg font-medium mb-2">
											<a href="/programs/{program.programs_id?.id || program.programs_id}" 
											   class="text-blue-600 hover:text-blue-800 hover:underline">
												📋 {program.programs_id?.title || 'Program'}
											</a>
										</h3>
										
										{#if program.programs_id?.production}
											<p class="text-gray-600 text-sm">
												Production: <a href="/productions/{program.programs_id.production.id}" 
															 class="text-blue-600 hover:underline">
													{program.programs_id.production.title}
												</a>
											</p>
										{/if}
										
										{#if program.programs_id?.published_date}
											<p class="text-gray-500 text-xs mt-1">
												Published: {new Date(program.programs_id.published_date).toLocaleDateString()}
											</p>
										{/if}
									</div>
								{/each}
							</div>
						</section>
					{/if}
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					{#if data.event.venue && data.event.venue.length > 0}
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-800 mb-3">📍 Venue{data.event.venue.length > 1 ? 's' : ''}</h3>
							<div class="space-y-3">
								{#each data.event.venue as venue}
									<div>
										<h4 class="font-medium">
											<a href="/venues/{venue.venues_id?.id || venue.venues_id}" 
											   class="text-blue-600 hover:text-blue-800 hover:underline">
												{venue.venues_id?.name || 'Unknown Venue'}
											</a>
										</h4>
										
										{#if venue.venues_id?.venue_type}
											<p class="text-sm text-gray-600">
												{venue.venues_id.venue_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
											</p>
										{/if}
										
										{#if venue.venues_id?.capacity}
											<p class="text-sm text-gray-600">
												Capacity: {venue.venues_id.capacity.toLocaleString()}
											</p>
										{/if}
										
										{#if venue.venues_id?.address}
											<p class="text-sm text-gray-600 mt-1">
												{venue.venues_id.address.street_address}
												{#if venue.venues_id.address.city}
													<br>{venue.venues_id.address.city.name}, {venue.venues_id.address.city.province}
												{/if}
											</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Event Status -->
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-3">Event Status</h3>
						<div class="space-y-2 text-sm">
							<p><strong>Status:</strong> {data.event.status}</p>
							{#if upcoming}
								<p class="text-green-600">🟢 Upcoming</p>
							{:else}
								<p class="text-gray-600">⚪ Past Event</p>
							{/if}
						</div>
					</div>

					<!-- Quick Actions -->
					<div class="bg-blue-50 rounded-lg p-4">
						<h3 class="font-semibold text-blue-800 mb-3">Quick Links</h3>
						<div class="space-y-2">
							{#if data.event.program && data.event.program.length > 0}
								{#each data.event.program.slice(0, 3) as program}
									<a href="/programs/{program.programs_id?.id || program.programs_id}" 
									   class="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
										📋 {program.programs_id?.title || 'Program'}
									</a>
								{/each}
							{/if}
							
							{#if data.event.venue && data.event.venue.length > 0}
								{#each data.event.venue.slice(0, 2) as venue}
									<a href="/venues/{venue.venues_id?.id || venue.venues_id}" 
									   class="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
										📍 {venue.venues_id?.name || 'Venue'}
									</a>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-white rounded-lg shadow-sm p-12 text-center">
		<h1 class="text-3xl font-bold text-red-600 mb-4">Event not found</h1>
		<p class="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
		<a href="/events" class="text-blue-600 hover:text-blue-800 hover:underline font-medium">
			← Back to events
		</a>
	</div>
{/if}