<script lang="ts">
	import { getEvent } from '../data.remote';

	type EventItem = {
		id: string;
		title?: string;
		start: string;
		end?: string | null;
		special_notes?: string;
		understudy_notes?: string;
		status?: string;
		venue?: Array<{ venues_id?: { id?: string; name?: string; venue_type?: string; capacity?: number; address?: { street_address?: string; city?: { name?: string; province?: string } } } | string }>;
		program?: Array<{ programs_id?: { id?: string; title?: string; published_date?: string; production?: { id: string; title: string } } | string }>;
	};

	function isEventItem(data: any): data is EventItem {
		return data && typeof data === 'object' && typeof data.id === 'string' && typeof data.start === 'string';
	}

	function formatEventTime(start: string, end?: string | null) {
		const startDate = new Date(start);
		const endDate = end ? new Date(end) : null;
		const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
		const dateStr = startDate.toLocaleDateString(undefined, dateOptions);
		const startTime = startDate.toLocaleTimeString(undefined, timeOptions);
		if (endDate) {
			const endTime = endDate.toLocaleTimeString(undefined, timeOptions);
			if (startDate.toDateString() === endDate.toDateString()) {
				return { date: dateStr, time: `${startTime} - ${endTime}` };
			} else {
				const endDateStr = endDate.toLocaleDateString(undefined, dateOptions);
				return { date: `${dateStr} - ${endDateStr}`, time: `${startTime} - ${endTime}` };
			}
		}
		return { date: dateStr, time: startTime };
	}

	function isUpcoming(eventDate: string) {
		return new Date(eventDate) > new Date();
	}

	function getDuration(start: string, end?: string | null) {
		if (!end) return null;
		const diff = new Date(end).getTime() - new Date(start).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
		return `${minutes}m`;
	}

	let { params } = $props<{ params: { id: string } }>();
</script>

<svelte:boundary>
	{#await getEvent(params.id) then event}
		{#if isEventItem(event)}
			{@const eventTime = formatEventTime(event.start, event.end ?? null)}
			{@const upcoming = isUpcoming(event.start)}
			{@const duration = getDuration(event.start, event.end ?? null)}

					<!-- Clean Layout -->
			<div class="max-w-4xl mx-auto bg-white">
				<!-- Header Section -->
				<header class="bg-gray-900 text-white p-8">
					<h1 class="text-3xl font-semibold mb-4">{event.title || 'Untitled Event'}</h1>

					<!-- Date/Time Block -->
					<div class="grid md:grid-cols-2 gap-6">
						<div>
							<div class="text-gray-400 text-sm mb-1">DATE</div>
							<div class="text-white text-xl">{eventTime.date}</div>
						</div>
						<div>
							<div class="text-gray-400 text-sm mb-1">TIME</div>
							<div class="text-white text-xl">{eventTime.time}</div>
							{#if duration}
								<div class="text-gray-300 text-sm mt-1">{duration}</div>
							{/if}
						</div>
					</div>
				</header>

							<!-- Main Content -->
				<main class="p-8">
					<div class="space-y-6">
						<!-- Event Notes -->
						{#if event.special_notes}
							<section>
								<h2 class="text-lg font-semibold mb-2">Notes</h2>
								<p class="text-gray-700">{event.special_notes}</p>
							</section>
						{/if}

						<!-- Cast Changes -->
						{#if event.understudy_notes}
							<section>
								<h2 class="text-lg font-semibold mb-2">Cast Changes</h2>
								<p class="text-gray-700">{event.understudy_notes}</p>
							</section>
						{/if}

						<!-- Venue -->
						{#if event.venue && Array.isArray(event.venue) && event.venue.length > 0}
							<section>
								<h2 class="text-lg font-semibold mb-2">Venue{event.venue.length > 1 ? 's' : ''}</h2>
								<div class="space-y-3">
									{#each event.venue as venue}
										<div>
											<h3 class="font-medium">
												<a href="/venues/{typeof venue.venues_id === 'object' && venue.venues_id?.id ? venue.venues_id.id : venue.venues_id}"
												   class="text-blue-600 hover:underline">
													{typeof venue.venues_id === 'object' && venue.venues_id?.name ? venue.venues_id.name : 'Unknown Venue'}
												</a>
											</h3>
											{#if typeof venue.venues_id === 'object' && venue.venues_id?.address}
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
							</section>
						{/if}

						<!-- Programs -->
						{#if event.program && Array.isArray(event.program) && event.program.length > 0}
							<section>
								<h2 class="text-lg font-semibold mb-2">Programs</h2>
								<div class="space-y-3">
									{#each event.program as program}
										<div>
											<h3 class="font-medium">
												<a href="/programs/{typeof program.programs_id === 'object' && program.programs_id?.id ? program.programs_id.id : program.programs_id}"
												   class="text-blue-600 hover:underline">
													{typeof program.programs_id === 'object' && program.programs_id?.title ? program.programs_id.title : 'Untitled Program'}
												</a>
											</h3>
											{#if typeof program.programs_id === 'object' && program.programs_id?.production}
												<p class="text-sm text-gray-600 mt-1">
													<a href="/productions/{program.programs_id.production.id}"
													   class="text-blue-600 hover:underline">
														{program.programs_id.production.title}
													</a>
												</p>
											{/if}
										</div>
									{/each}
								</div>
							</section>
						{/if}

						<!-- Back Link -->
						<div class="pt-6 border-t">
							<a href="/events" class="text-blue-600 hover:underline">← Back to Events</a>
						</div>
					</div>
				</main>
		</div>
		{/if}
	{:catch error}
		<!-- Error State -->
		<div class="min-h-screen bg-gray-50 flex items-center justify-center">
			<div class="bg-white rounded-lg p-8 text-center max-w-md">
				<h2 class="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
				<p class="text-gray-600 mb-6">Failed to load the event details.</p>
				<button onclick={() => location.reload()} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3">
					Try Again
				</button>
				<a href="/events" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
					Back to Events
				</a>
			</div>
		</div>
	{/await}

	{#snippet pending()}
		<div class="min-h-screen bg-gray-50 flex items-center justify-center">
			<div class="text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
				<p class="text-gray-600">Loading...</p>
			</div>
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="min-h-screen bg-gray-50 flex items-center justify-center">
			<div class="bg-white rounded-lg p-8 text-center max-w-md">
				<h2 class="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
				<p class="text-gray-600 mb-6">Failed to load the event details.</p>
				<button onclick={reset} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3">
					Try Again
				</button>
				<a href="/events" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
					Back to Events
				</a>
			</div>
		</div>
	{/snippet}
</svelte:boundary>