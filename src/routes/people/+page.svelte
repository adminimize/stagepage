<script>
	import { getPeople } from './data.remote';
	import List from '$lib/components/List.svelte';
</script>

<svelte:boundary>
	<List 
		items={await getPeople()} 
		title="People" 
		sortKey="full_name" 
		linkPrefix="/people" 
	/>

	{#snippet pending()}
		<div class="loading">Loading people...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load people</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>