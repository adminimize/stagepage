<script>
let { data } = $props();
</script>

{#if data.song}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold mb-2">{data.song.title}</h1>
		
		{#if data.song.subtitle}
			<p class="text-xl text-gray-600 mb-6">{data.song.subtitle}</p>
		{/if}

		<div class="grid md:grid-cols-3 gap-8">
			<div class="md:col-span-2">
				{#if data.song.lyrics && data.song.show_lyrics}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Lyrics</h2>
						<div class="prose max-w-none bg-gray-50 p-6 rounded-lg">
							{@html data.song.lyrics}
						</div>
					</section>
				{/if}

				{#if data.song.translation && data.song.show_translation}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Translation</h2>
						<div class="prose max-w-none bg-blue-50 p-6 rounded-lg">
							{@html data.song.translation}
						</div>
					</section>
				{/if}

				{#if data.song.program_notes}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Program Notes</h2>
						<div class="prose max-w-none">
							{@html data.song.program_notes}
						</div>
					</section>
				{/if}

				{#if data.song.composer_notes}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Composer Notes</h2>
						<div class="prose max-w-none">
							<p class="whitespace-pre-wrap">{data.song.composer_notes}</p>
						</div>
					</section>
				{/if}

				{#if data.song.credits && data.song.credits.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Credits</h2>
						<div class="grid gap-3">
							{#each data.song.credits as credit}
								<div class="border rounded-lg p-3">
									<div class="flex justify-between items-start">
										<div>
											<h4 class="font-medium">
												<a href="/people/{credit.people_id?.id || credit.people_id}" 
												   class="text-blue-600 hover:text-blue-800 hover:underline">
													{credit.people_id?.stage_name || credit.people_id?.full_name || 'Unknown Person'}
												</a>
											</h4>
											{#if credit.roles}
												<p class="text-sm text-gray-600">{credit.roles.name}</p>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.song.shows && data.song.shows.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Featured In Shows</h2>
						<div class="grid gap-3">
							{#each data.song.shows as show}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/shows/{show.shows_id?.id || show.shows_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{show.shows_id?.title || 'Unknown Show'}
										</a>
									</h3>
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			<div class="space-y-6">
				{#if data.song.genre || data.song.period}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-3">Classification</h3>
						<div class="space-y-2 text-sm">
							{#if data.song.genre}
								<p><strong>Genre:</strong> {data.song.genre.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
							{/if}
							{#if data.song.period}
								<p><strong>Period:</strong> {data.song.period.replace(/\b\w/g, l => l.toUpperCase())}</p>
							{/if}
						</div>
					</div>
				{/if}

				{#if data.song.key_signature || data.song.tempo_marking || data.song.duration}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-3">Musical Details</h3>
						<div class="space-y-2 text-sm">
							{#if data.song.key_signature}
								<p><strong>Key:</strong> {data.song.key_signature}</p>
							{/if}
							{#if data.song.tempo_marking}
								<p><strong>Tempo:</strong> {data.song.tempo_marking}</p>
							{/if}
							{#if data.song.duration}
								<p><strong>Duration:</strong> {Math.floor(data.song.duration / 60)}:{(data.song.duration % 60).toString().padStart(2, '0')}</p>
							{/if}
						</div>
					</div>
				{/if}

				{#if data.song.opus_number || data.song.movement_number}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-3">Catalog Information</h3>
						<div class="space-y-2 text-sm">
							{#if data.song.opus_number}
								<p><strong>Opus:</strong> {data.song.opus_number}</p>
							{/if}
							{#if data.song.movement_number}
								<p><strong>Movement:</strong> {data.song.movement_number}</p>
							{/if}
						</div>
					</div>
				{/if}

				{#if data.song.instrumentation_notes}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-3">Instrumentation</h3>
						<p class="text-sm whitespace-pre-wrap">{data.song.instrumentation_notes}</p>
					</div>
				{/if}
			</div>
		</div>

		<footer class="mt-8 pt-4 border-t text-sm text-gray-500">
			<p>Status: {data.song.status}</p>
		</footer>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600">Song not found</h1>
		<p class="mt-4"><a href="/songs" class="text-blue-600 hover:underline">← Back to songs</a></p>
	</div>
{/if}