<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.people} 
	title="People" 
	sortKey="full_name" 
	linkPrefix="/people" 
/>