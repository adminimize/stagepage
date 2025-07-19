<script>
let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-4">{data.show.title}</h1>
	
	{#if data.show.description}
		<p class="text-lg text-gray-700 mb-6">{data.show.description}</p>
	{/if}

	{#if data.show.roles && data.show.roles.length > 0}
		<section class="mb-6">
			<h2 class="text-2xl font-semibold mb-3">Cast</h2>
			<ul class="list-disc pl-6 space-y-1">
				{#each data.show.roles.sort((a, b) => a.billing_order - b.billing_order) as role}
					<li>{role.name}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.show.songs && data.show.songs.length > 0}
		<section class="mb-6">
			<h2 class="text-2xl font-semibold mb-3">Songs</h2>
			<ul class="list-disc pl-6 space-y-1">
				{#each data.show.songs as song}
					<li>{song.title}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.show.credits && data.show.credits.length > 0}
		<section class="mb-6">
			<h2 class="text-2xl font-semibold mb-3">Credits</h2>
			<ul class="list-disc pl-6 space-y-1">
				{#each data.show.credits as credit}
					<li>{credit.name} - {credit.role}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<footer class="mt-8 pt-4 border-t text-sm text-gray-500">
		<p>Status: {data.show.status}</p>
		{#if data.show.slug}
			<p>Slug: {data.show.slug}</p>
		{/if}
	</footer>
</div>
