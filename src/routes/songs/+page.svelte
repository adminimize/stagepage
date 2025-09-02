<script>
	import { getSongs } from './data.remote';
	import List from '$lib/components/List.svelte';
</script>

<svelte:boundary>
	<List 
		items={await getSongs()} 
		title="Songs" 
		sortKey="title" 
		linkPrefix="/songs" 
	/>

	{#snippet pending()}
		<div class="loading">Loading songs...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load songs</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>