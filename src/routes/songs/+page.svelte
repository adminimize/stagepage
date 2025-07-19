<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.songs} 
	title="Songs" 
	sortKey="title" 
	linkPrefix="/songs" 
/>