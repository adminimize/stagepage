<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.programs} 
	title="Programs" 
	sortKey="title" 
	linkPrefix="/programs" 
/>