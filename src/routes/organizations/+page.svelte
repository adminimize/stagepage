<script>
import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<List 
	items={data.organizations} 
	title="Organizations" 
	sortKey="name" 
	linkPrefix="/organizations" 
/>