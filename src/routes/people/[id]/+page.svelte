<script>
let { data } = $props();
</script>

{#if data.person}
	<div class="container mx-auto px-4 py-8">
		<div class="grid md:grid-cols-3 gap-8">
			<div class="md:col-span-1">
				<div class="w-full max-w-sm mx-auto mb-6">
					<img 
						src="{data.person.headshot?.filename_disk ? `/assets/${data.person.headshot.filename_disk}` : `https://placehold.co/400x500?text=${encodeURIComponent(data.person.stage_name || data.person.full_name)}`}" 
						alt="{data.person.stage_name || data.person.full_name} headshot"
						class="w-full rounded-lg shadow-lg"
					/>
				</div>

				<div class="space-y-4">
					{#if data.person.website}
						<a href={data.person.website} target="_blank" rel="noopener noreferrer" 
						   class="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
							Visit Website
						</a>
					{/if}

					<div class="space-y-2">
						{#if data.person.instagram}
							<a href="https://instagram.com/{data.person.instagram}" target="_blank" rel="noopener noreferrer" 
							   class="block text-blue-600 hover:text-blue-800 hover:underline">
								📷 @{data.person.instagram}
							</a>
						{/if}
						
						{#if data.person.twitter_x}
							<a href="https://twitter.com/{data.person.twitter_x}" target="_blank" rel="noopener noreferrer" 
							   class="block text-blue-600 hover:text-blue-800 hover:underline">
								🐦 @{data.person.twitter_x}
							</a>
						{/if}
						
						{#if data.person.linkedin}
							<a href={data.person.linkedin.startsWith('http') ? data.person.linkedin : `https://linkedin.com/in/${data.person.linkedin}`} 
							   target="_blank" rel="noopener noreferrer" 
							   class="block text-blue-600 hover:text-blue-800 hover:underline">
								💼 LinkedIn
							</a>
						{/if}
						
						{#if data.person.tiktok}
							<a href="https://tiktok.com/@{data.person.tiktok}" target="_blank" rel="noopener noreferrer" 
							   class="block text-blue-600 hover:text-blue-800 hover:underline">
								🎵 @{data.person.tiktok}
							</a>
						{/if}
					</div>
				</div>
			</div>

			<div class="md:col-span-2">
				<h1 class="text-4xl font-bold mb-2">{data.person.stage_name || data.person.full_name}</h1>
				
				{#if data.person.stage_name && data.person.full_name !== data.person.stage_name}
					<p class="text-xl text-gray-600 mb-4">{data.person.full_name}</p>
				{/if}
				
				{#if data.person.pronouns}
					<p class="text-lg text-gray-500 mb-6">{data.person.pronouns.label}</p>
				{/if}

				{#if data.person.default_bio}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Biography</h2>
						<div class="prose max-w-none">
							<p class="whitespace-pre-wrap">{data.person.default_bio}</p>
						</div>
					</section>
				{/if}

				{#if data.person.productions && data.person.productions.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Productions</h2>
						<div class="grid gap-4">
							{#each data.person.productions as production}
								<div class="border rounded-lg p-4">
									<h3 class="text-lg font-medium">
										<a href="/productions/{production.productions_id?.id || production.productions_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{production.productions_id?.title || 'Untitled Production'}
										</a>
									</h3>
									{#if production.role}
										<p class="text-gray-600">Role: {production.role.name}</p>
									{/if}
									{#if production.bio_override}
										<p class="text-gray-700 mt-2">{production.bio_override}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.person.programs && data.person.programs.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Programs</h2>
						<div class="grid gap-3">
							{#each data.person.programs as program}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/programs/{program.programs_id?.id || program.programs_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{program.programs_id?.title || 'Untitled Program'}
										</a>
									</h3>
									{#if program.role}
										<p class="text-sm text-gray-600">Role: {program.role.name}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.person.shows && data.person.shows.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Shows</h2>
						<div class="grid gap-3">
							{#each data.person.shows as show}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/shows/{show.shows_id?.id || show.shows_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{show.shows_id?.title || 'Untitled Show'}
										</a>
									</h3>
									{#if show.role}
										<p class="text-sm text-gray-600">Role: {show.role.name}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.person.songs && data.person.songs.length > 0}
					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">Songs</h2>
						<div class="grid gap-3">
							{#each data.person.songs as song}
								<div class="border rounded-lg p-3">
									<h3 class="font-medium">
										<a href="/songs/{song.songs_id?.id || song.songs_id}" 
										   class="text-blue-600 hover:text-blue-800 hover:underline">
											{song.songs_id?.title || 'Untitled Song'}
										</a>
									</h3>
									{#if song.roles}
										<p class="text-sm text-gray-600">Role: {song.roles.name}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600">Person not found</h1>
		<p class="mt-4"><a href="/people" class="text-blue-600 hover:underline">← Back to people</a></p>
	</div>
{/if}