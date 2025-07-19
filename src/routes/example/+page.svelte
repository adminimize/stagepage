<script lang="ts">
  import type { Page, Post, DirectusFile } from '$lib/types';

  export let data: {
    pages: Page[];
    posts: Post[];
    files: DirectusFile[];
  };
</script>

<h1>Directus TypeScript Types Example</h1>

<div class="grid">
  <section>
    <h2>Pages ({data.pages.length})</h2>
    {#each data.pages as page}
      <div class="card">
        <h3>{page.title}</h3>
        <p>Status: {page.status}</p>
        <p>Permalink: {page.permalink || 'N/A'}</p>
      </div>
    {/each}
  </section>

  <section>
    <h2>Posts ({data.posts.length})</h2>
    {#each data.posts as post}
      <div class="card">
        <h3>{post.title || 'Untitled'}</h3>
        <p>Status: {post.status}</p>
        {#if post.date_created}
          <p>Created: {new Date(post.date_created).toLocaleDateString()}</p>
        {/if}
        {#if post.content}
          <p class="content">{post.content.substring(0, 100)}...</p>
        {/if}
      </div>
    {/each}
  </section>

  <section>
    <h2>Files ({data.files.length})</h2>
    {#each data.files as file}
      <div class="card">
        <h3>{file.title || file.filename_download || 'Untitled'}</h3>
        <p>Type: {file.type}</p>
        <p>Size: {file.filesize ? (file.filesize / 1024).toFixed(1) + ' KB' : 'Unknown'}</p>
        {#if file.width && file.height}
          <p>Dimensions: {file.width} × {file.height}</p>
        {/if}
        {#if file.description}
          <p class="description">{file.description}</p>
        {/if}
      </div>
    {/each}
  </section>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .card h3 {
    margin-top: 0;
    color: #333;
  }

  .content, .description {
    font-style: italic;
    color: #666;
  }

  section h2 {
    border-bottom: 2px solid #333;
    padding-bottom: 0.5rem;
  }
</style> 