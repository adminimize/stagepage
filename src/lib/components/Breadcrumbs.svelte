<script>
import { page } from '$app/stores';

let { customBreadcrumbs = [] } = $props();

// Generate breadcrumbs from URL path
let pathSegments = $derived($page.url.pathname.split('/').filter(Boolean));
let breadcrumbs = $derived(customBreadcrumbs.length > 0 ? customBreadcrumbs : generateBreadcrumbs(pathSegments));

function generateBreadcrumbs(segments) {
	const crumbs = [{ name: 'Home', href: '/' }];
	let currentPath = '';
	
	segments.forEach((segment, index) => {
		currentPath += `/${segment}`;
		
		// Skip if it's a UUID (detail page)
		if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
			// This is a detail page, we'll handle the name via props or context
			return;
		}
		
		// Convert route names to readable format
		const name = segment
			.replace(/-/g, ' ')
			.replace(/\b\w/g, l => l.toUpperCase());
		
		crumbs.push({
			name,
			href: currentPath,
			active: index === segments.length - 1
		});
	});
	
	return crumbs;
}
</script>

<nav class="flex mb-6" aria-label="Breadcrumb">
	<ol class="inline-flex items-center space-x-1 md:space-x-3">
		{#each breadcrumbs as crumb, index}
			<li class="inline-flex items-center">
				{#if index > 0}
					<span class="text-gray-400 dark:text-gray-500 mx-2">/</span>
				{/if}

				{#if crumb.active}
					<span class="text-sm font-medium text-gray-500 dark:text-gray-400" aria-current="page">
						{crumb.name}
					</span>
				{:else}
					<a href={crumb.href} class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
						{crumb.name}
					</a>
				{/if}
			</li>
		{/each}
	</ol>
</nav>