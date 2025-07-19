<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.festivals} 
	title="Festivals" 
	sortKey="title" 
	linkPrefix="/festivals" 
/>