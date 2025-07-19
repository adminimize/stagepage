<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.productions} 
	title="Productions" 
	sortKey="title" 
	linkPrefix="/productions" 
/>