<script>
	import { getOrganizations } from './data.remote';
	import List from '$lib/components/List.svelte';
</script>

<svelte:boundary>
	<List 
		items={await getOrganizations()} 
		title="Organizations" 
		sortKey="name" 
		linkPrefix="/organizations" 
	/>

	{#snippet pending()}
		<div class="loading">Loading organizations...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load organizations</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>