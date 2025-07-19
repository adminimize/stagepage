<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.venues} 
	title="Venues" 
	sortKey="name" 
	linkPrefix="/venues" 
/>