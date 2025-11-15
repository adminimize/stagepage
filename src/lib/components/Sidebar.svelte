<script>
import { page } from '$app/stores';
import DarkModeToggle from './DarkModeToggle.svelte';

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
	class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-gray-100"
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
	fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
	{isOpen ? 'translate-x-0' : '-translate-x-full'}
	lg:translate-x-0
">
	<div class="h-full px-3 py-4 overflow-y-auto">
		<!-- Logo/Title -->
		<div class="mb-8 px-3">
			<div class="flex items-center justify-between mb-2">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					<a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
						StagePage
					</a>
				</h1>
				<DarkModeToggle />
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Digital Theater Programs</p>
		</div>
		
		<!-- Navigation -->
		<nav>
			<ul class="space-y-2">
				{#each navigationItems as item}
					<li>
						<a
							href={item.href}
							class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors {isActiveRoute(item.href) ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-100 dark:bg-gray-700' : ''}"
							onclick={() => { if (window.innerWidth < 1024) isOpen = false; }}
						>
							{item.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		
		<!-- Footer -->
		<div class="absolute bottom-4 left-3 right-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
			<p>Theater Festival Management</p>
			<p class="mt-1">Built with SvelteKit</p>
		</div>
	</div>
</aside>