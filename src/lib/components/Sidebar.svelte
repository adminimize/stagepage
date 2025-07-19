<script>
import { page } from '$app/stores';

let { isOpen = false } = $props();

let currentPath = $derived($page.url.pathname);

const navigationItems = [
	{
		name: 'Home',
		href: '/'
	},
	{
		name: 'Festivals',
		href: '/festivals'
	},
	{
		name: 'Productions',
		href: '/productions'
	},
	{
		name: 'Shows',
		href: '/shows'
	},
	{
		name: 'Programs',
		href: '/programs'
	},
	{
		name: 'People',
		href: '/people'
	},
	{
		name: 'Organizations',
		href: '/organizations'
	},
	{
		name: 'Venues',
		href: '/venues'
	},
	{
		name: 'Songs',
		href: '/songs'
	},
	{
		name: 'Events',
		href: '/events'
	}
];

function isActiveRoute(href) {
	if (href === '/') return currentPath === '/';
	return currentPath.startsWith(href);
}
</script>

<!-- Mobile menu button -->
<button 
	class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
	onclick={() => isOpen = !isOpen}
	aria-label="Toggle navigation menu"
>
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		{#if isOpen}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
		{:else}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
		{/if}
	</svg>
</button>

<!-- Sidebar overlay for mobile -->
{#if isOpen}
	<div 
		class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
		onclick={() => isOpen = false}
		aria-hidden="true"
	></div>
{/if}

<!-- Sidebar -->
<aside class="
	fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-gray-200
	{isOpen ? 'translate-x-0' : '-translate-x-full'}
	lg:translate-x-0
">
	<div class="h-full px-3 py-4 overflow-y-auto">
		<!-- Logo/Title -->
		<div class="mb-8 px-3">
			<h1 class="text-2xl font-bold text-gray-900">
				<a href="/" class="hover:text-blue-600 transition-colors">
					StagePage
				</a>
			</h1>
			<p class="text-sm text-gray-600 mt-1">Digital Theater Programs</p>
		</div>
		
		<!-- Navigation -->
		<nav>
			<ul class="space-y-2">
				{#each navigationItems as item}
					<li>
						<a
							href={item.href}
							class="block p-3 text-gray-900 hover:text-blue-600 transition-colors {isActiveRoute(item.href) ? 'text-blue-600 font-medium border-l-2 border-blue-600 bg-blue-50' : ''}"
							onclick={() => { if (window.innerWidth < 1024) isOpen = false; }}
						>
							{item.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		
		<!-- Footer -->
		<div class="absolute bottom-4 left-3 right-3 text-xs text-gray-500 border-t border-gray-200 pt-4">
			<p>Theater Festival Management</p>
			<p class="mt-1">Built with SvelteKit</p>
		</div>
	</div>
</aside>