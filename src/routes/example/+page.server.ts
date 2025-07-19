import { getPages, getPosts, getFiles } from '$lib/directus';
import type { Page, Post, DirectusFile } from '$lib/types';

export const load = async () => {
  try {
    // Get all published pages with type safety
    const pages: Page[] = await getPages({
      fields: ['*'],
      filter: { status: { _eq: 'published' } },
      sort: ['sort']
    });

    // Get recent posts
    const posts: Post[] = await getPosts({
      fields: ['*'],
      filter: { status: { _eq: 'published' } },
      sort: ['-date_created'],
      limit: 5
    });

    // Get some files for demonstration
    const files: DirectusFile[] = await getFiles({
      fields: ['*'],
      limit: 10
    });

    return {
      pages,
      posts,
      files
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      pages: [],
      posts: [],
      files: []
    };
  }
}; 