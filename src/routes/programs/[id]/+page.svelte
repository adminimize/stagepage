<script>
import Program from '$lib/components/Program.svelte';

let { data } = $props();
</script>

{#if data.program}
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
		<Program program={data.program} />
	</div>
{:else}
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-red-600 dark:text-red-400">Program not found</h1>
		<p class="mt-4"><a href="/programs" class="text-blue-600 dark:text-blue-400 hover:underline">← Back to programs</a></p>
	</div>
{/if}

<style>
	.program-section {
		page-break-inside: avoid;
	}
	
	@media print {
		.program-section {
			break-inside: avoid;
		}
	}
</style>