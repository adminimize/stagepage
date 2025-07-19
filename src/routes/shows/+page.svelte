<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.shows} 
	title="Shows" 
	sortKey="title" 
	linkPrefix="/shows" 
/>