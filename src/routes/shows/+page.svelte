<script>
	import { getShows } from './data.remote';
	import List from '$lib/components/List.svelte';
</script>

<svelte:boundary>
	<List 
		items={await getShows()} 
		title="Shows" 
		sortKey="title" 
		linkPrefix="/shows" 
	/>

	{#snippet pending()}
		<div class="loading">Loading shows...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load shows</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>