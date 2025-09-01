<script>
	import { getPrograms } from './data.remote';
	import List from '$lib/components/List.svelte';

let { data } = $props();
</script>

<svelte:boundary>
	<ul>
		{#each await getPrograms() as { title, slug }}
			<li><a href="/blog/{slug}">{title}</a></li>
		{/each}
	</ul>
	

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>



<List 
	items={data.programs} 
	title="Programs" 
	sortKey="title" 
	linkPrefix="/programs" 
/>