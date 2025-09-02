<script lang="ts">
	import { getEvents } from './data.remote';

	type EventItem = {
		id: string;
		title?: string;
		start: string;
		end?: string | null;
		special_notes?: string;
		venue?: Array<{ venues_id?: { name?: string } | null }>;
		program?: Array<{ programs_id?: { title?: string } | null }>;
	};

	function isEventItem(data: any): data is EventItem {
		return data && typeof data === 'object' && typeof data.id === 'string' && typeof data.start === 'string';
	}

	function formatEventTime(start: string, end?: string | null) {
		const startDate = new Date(start);
		const endDate = end ? new Date(end) : null;
		const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

		if (endDate) {
			const endTime = endDate.toLocaleTimeString(undefined, timeOptions);
			const startTime = startDate.toLocaleTimeString(undefined, timeOptions);
			if (startDate.toDateString() === endDate.toDateString()) {
				return `${startTime} - ${endTime}`;
			} else {
				const endDateStr = endDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
				return `${startTime} - ${endDateStr} ${endTime}`;
			}
		}
		return startDate.toLocaleTimeString(undefined, timeOptions);
	}

	function groupEventsByDate(events: EventItem[]) {
		const grouped: { [key: string]: EventItem[] } = {};

		events.forEach(event => {
			const date = new Date(event.start).toDateString();
			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(event);
		});

		// Sort events within each day by start time
		Object.keys(grouped).forEach(date => {
			grouped[date].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
		});

		return grouped;
	}

	function formatDateHeader(dateStr: string) {
		const date = new Date(dateStr);
		const today = new Date();
		const tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		} else {
			return date.toLocaleDateString(undefined, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}
	}

	function isUpcoming(eventDate: string) {
		return new Date(eventDate) > new Date();
	}

	function isPast(eventDate: string) {
		return new Date(eventDate) < new Date();
	}
</script>

<svelte:boundary>
	{#await getEvents() then events}
		{#if Array.isArray(events) && events.length > 0}
			{@const validEvents = events.filter(isEventItem)}
			{@const groupedEvents = groupEventsByDate(validEvents)}
			{@const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())}

			<!-- Clean Layout -->
			<div class="max-w-4xl mx-auto">
				<!-- Header -->
				<header class="p-8 border-b">
					<h1 class="text-3xl font-semibold mb-2">Events</h1>
					<p class="text-gray-600">Performance schedules and special events</p>
				</header>

				<!-- Events by Date -->
				<main class="px-8 pb-8">
					{#each sortedDates as dateStr}
						{@const dateEvents = groupedEvents[dateStr]}

						<!-- Date Header -->
						<section class="mb-8">
							<div class="border-b border-gray-200 py-4 mb-4">
								<h2 class="text-xl font-semibold text-gray-900">
									{formatDateHeader(dateStr)}
								</h2>
							</div>

							<!-- Events for this date -->
							<div class="space-y-2">
								{#each dateEvents as event}
									<a href="/events/{event.id}" class="block bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors">
										<div class="flex items-start gap-4">
											<!-- Time -->
											<div class="flex-shrink-0 w-20 text-sm font-medium text-gray-600">
												{formatEventTime(event.start, event.end ?? null)}
											</div>

											<!-- Event Info -->
											<div class="flex-1">
												<h3 class="font-medium text-gray-900">
													{event.title || 'Untitled Event'}
												</h3>

												{#if event.venue && Array.isArray(event.venue) && event.venue.length > 0}
													<p class="text-sm text-gray-600 mt-1">
														{event.venue
															.map(v => typeof v.venues_id === 'object' && v.venues_id?.name ? v.venues_id.name : 'Venue')
															.join(', ')}
													</p>
												{/if}

												{#if event.special_notes}
													<p class="text-sm text-amber-800 mt-1 italic">
														{event.special_notes}
													</p>
												{/if}
											</div>
										</div>
									</a>
								{/each}
							</div>
						</section>
					{/each}

					{#if sortedDates.length === 0}
						<div class="text-center py-12">
							<h3 class="text-xl font-medium text-gray-600 mb-2">No Events Scheduled</h3>
							<p class="text-gray-500">Check back later for upcoming performances and events.</p>
						</div>
					{/if}
				</main>
			</div>
		{:else}
			<!-- No Events or Invalid Data -->
			<div class="min-h-screen bg-gray-50 flex items-center justify-center">
				<div class="bg-white rounded-lg p-12 text-center max-w-md">
					<h1 class="text-2xl font-semibold text-gray-900 mb-2">No Events Found</h1>
					<p class="text-gray-600 mb-6">There are currently no events scheduled.</p>
					<p class="text-gray-500 text-sm">Check back later for upcoming performances and events.</p>
				</div>
			</div>
		{/if}
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
				<p class="text-gray-600 mb-6">Failed to load the event schedule.</p>
				<button onclick={reset} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3">
					Try Again
				</button>
				<a href="/" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
					Back to Home
				</a>
			</div>
		</div>
	{/snippet}
</svelte:boundary>