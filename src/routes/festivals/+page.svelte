<script>
	import { getFestivals } from './data.remote';
	import List from '$lib/components/List.svelte';
</script>

<svelte:boundary>
	<List 
		items={await getFestivals()} 
		title="Festivals" 
		sortKey="title" 
		linkPrefix="/festivals" 
	/>

	{#snippet pending()}
		<div class="loading">Loading festivals...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load festivals</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>