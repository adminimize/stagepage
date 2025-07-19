import { createDirectus, rest, readItems, readItem } from '@directus/sdk';
import type { DirectusFile, DirectusUser, Page, Post } from './types';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// Create a typed Directus client
const directus = createDirectus(PUBLIC_DIRECTUS_URL).with(rest());

export async function createDirectusClient() {
	return createDirectus(PUBLIC_DIRECTUS_URL).with(rest());
}

// Example functions with proper typing

// Get all pages with type safety
export async function getPages(query?: any) {
	const response = await directus.request(readItems('pages', query));
	return response as Page[];
}

// Get a single page by ID
export async function getPage(id: string, query?: any) {
	const response = await directus.request(readItem('pages', id, query));
	return response as Page;
}

// Get all posts
export async function getPosts(query?: any) {
	const response = await directus.request(readItems('posts', query));
	return response as Post[];
}

// Get a single post by ID
export async function getPost(id: string, query?: any) {
	const response = await directus.request(readItem('posts', id, query));
	return response as Post;
}

// Get files
export async function getFiles(query?: any) {
	const response = await directus.request(readItems('files', query));
	return response as DirectusFile[];
}

// Get a single file by ID
export async function getFile(id: string, query?: any) {
	const response = await directus.request(readItem('files', id, query));
	return response as DirectusFile;
}

// Export the client for direct use
export { directus };
