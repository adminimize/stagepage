<script>
	import { getPrograms } from './data.remote';
	import List from '$lib/components/List.svelte';
</script>

<svelte:boundary>
	<List 
		items={await getPrograms()} 
		title="Programs" 
		sortKey="title" 
		linkPrefix="/programs" 
	/>

	{#snippet pending()}
		<p>Loading programs...</p>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load programs</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>