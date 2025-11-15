<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { children, isOpen = $bindable() } = $props();
	let sidebarOpen = $state(false);
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<Sidebar bind:isOpen={sidebarOpen} />

	<!-- Main content -->
	<div class="lg:ml-64">
		<main class="p-4 lg:p-8">
			<div class="mx-auto max-w-7xl">
				<Breadcrumbs />
				{@render children()}
			</div>
		</main>
	</div>
</div>
