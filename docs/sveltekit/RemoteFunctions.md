Remote functions
On this page
Remote functions
Overview
query
form
command
prerender
Handling validation errors
Using getRequestEvent
Redirects
Available since 2.27

Remote functions are a tool for type-safe communication between client and server. They can be called anywhere in your app, but always run on the server, meaning they can safely access server-only modules containing things like environment variables and database clients.

Combined with Svelte’s experimental support for await, it allows you to load and manipulate data directly inside your components.

This feature is currently experimental, meaning it is likely to contain bugs and is subject to change without notice. You must opt in by adding the kit.experimental.remoteFunctions option in your svelte.config.js and optionally, the compilerOptions.experimental.async option to use await in components:

svelte.config

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
Overview
Remote functions are exported from a .remote.js or .remote.ts file, and come in four flavours: query, form, command and prerender. On the client, the exported functions are transformed to fetch wrappers that invoke their counterparts on the server via a generated HTTP endpoint. Remote files must be placed in your src directory.

query
The query function allows you to read dynamic data from the server (for static data, consider using prerender instead):

src/routes/blog/data.remote

import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at
		DESC
	`;

	return posts;
});
Throughout this page, you’ll see imports from fictional modules like $lib/server/database and $lib/server/auth. These are purely for illustrative purposes — you can use whatever database client and auth setup you like.

The db.sql function above is a tagged template function that escapes any interpolated values.

The query returned from getPosts works as a Promise that resolves to posts:

src/routes/blog/+page

<script lang="ts">
	import { getPosts } from './data.remote';
</script>

<h1>Recent posts</h1>

<ul>
	{#each await getPosts() as { title, slug }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
Until the promise resolves — and if it errors — the nearest <svelte:boundary> will be invoked.

While using await is recommended, as an alternative the query also has loading, error and current properties:

src/routes/blog/+page

<script lang="ts">
	import { getPosts } from './data.remote';

	const query = getPosts();
</script>

<h1>Recent posts</h1>

{#if query.error}
	<p>oops!</p>
{:else if query.loading}
	<p>loading...</p>
{:else}
	<ul>
		{#each query.current as { title, slug }}
			<li><a href="/blog/{slug}">{title}</a></li>
		{/each}
	</ul>
{/if}
For the rest of this document, we’ll use the await form.

Query arguments
Query functions can accept an argument, such as the slug of an individual post:

src/routes/blog/[slug]/+page

<script lang="ts">
	import { getPost } from '../data.remote';

	let { params } = $props();

	const post = $derived(await getPost(params.slug));
</script>

<h1>{post.title}</h1>
<div>{@html post.content}</div>
Since getPost exposes an HTTP endpoint, it’s important to validate this argument to be sure that it’s the correct type. For this, we can use any Standard Schema validation library such as Zod or Valibot:

src/routes/blog/data.remote

import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`
		SELECT * FROM post
		WHERE slug = ${slug}
	`;

	if (!post) error(404, 'Not found');
	return post;
});
Both the argument and the return value are serialized with devalue, which handles types like Date and Map (and custom types defined in your transport hook) in addition to JSON.

Refreshing queries
Any query can be re-fetched via its refresh method, which retrieves the latest value from the server:


<button onclick={() => getPosts().refresh()}>
	Check for new posts
</button>
Queries are cached while they’re on the page, meaning getPosts() === getPosts(). This means you don’t need a reference like const posts = getPosts() in order to update the query.

form
The form function makes it easy to write data to the server. It takes a callback that receives the current FormData...

src/routes/blog/data.remote

import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { query, form } from '$app/server';
import * as db from '$lib/server/database';
import * as auth from '$lib/server/auth';

export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => { /* ... */ });

export const createPost = form(async (data) => {
	// Check the user is logged in
	const user = await auth.getUser();
	if (!user) error(401, 'Unauthorized');

	const title = data.get('title');
	const content = data.get('content');

	// Check the data is valid
	if (typeof title !== 'string' || typeof content !== 'string') {
		error(400, 'Title and content are required');
	}

	const slug = title.toLowerCase().replace(/ /g, '-');

	// Insert into the database
	await db.sql`
		INSERT INTO post (slug, title, content)
		VALUES (${slug}, ${title}, ${content})
	`;

	// Redirect to the newly created page
	redirect(303, `/blog/${slug}`);
});
...and returns an object that can be spread onto a <form> element. The callback is called whenever the form is submitted.

src/routes/blog/new/+page

<script lang="ts">
	import { createPost } from '../data.remote';
</script>

<h1>Create a new post</h1>

<form {...createPost}>
	<label>
		<h2>Title</h2>
		<input name="title" />
	</label>

	<label>
		<h2>Write your post</h2>
		<textarea name="content"></textarea>
	</label>

	<button>Publish!</button>
</form>
The form object contains method and action properties that allow it to work without JavaScript (i.e. it submits data and reloads the page). It also has an onsubmit handler that progressively enhances the form when JavaScript is available, submitting data without reloading the entire page.

Single-flight mutations
By default, all queries used on the page (along with any load functions) are automatically refreshed following a successful form submission. This ensures that everything is up-to-date, but it’s also inefficient: many queries will be unchanged, and it requires a second trip to the server to get the updated data.

Instead, we can specify which queries should be refreshed in response to a particular form submission. This is called a single-flight mutation, and there are two ways to achieve it. The first is to refresh the query on the server, inside the form handler:


export const getPosts = query(async () => { /* ... */ });

export const getPost = query(v.string(), async (slug) => { /* ... */ });

export const createPost = form(async (data) => {
	// form logic goes here...

	// Refresh `getPosts()` on the server, and send
	// the data back with the result of `createPost`
	await getPosts().refresh();

	// Redirect to the newly created page
	redirect(303, `/blog/${slug}`);
});

export const updatePost = form(async (data) => {
	// form logic goes here...
	const result = externalApi.update(post);

	// The API already gives us the updated post,
	// no need to refresh it, we can set it directly
	await getPost(post.id).set(result);
});
The second is to drive the single-flight mutation from the client, which we’ll see in the section on enhance.

Returns and redirects
The example above uses redirect(...), which sends the user to the newly created page. Alternatively, the callback could return data, in which case it would be available as createPost.result:

src/routes/blog/data.remote

export const createPost = form(async (data) => {
	// ...

	return { success: true };
});
src/routes/blog/new/+page

<script lang="ts">
	import { createPost } from '../data.remote';
</script>

<h1>Create a new post</h1>

<form {...createPost}><!-- ... --></form>

{#if createPost.result?.success}
	<p>Successfully published!</p>
{/if}
This value is ephemeral — it will vanish if you resubmit, navigate away, or reload the page.

The result value need not indicate success — it can also contain validation errors, along with any data that should repopulate the form on page reload.

If an error occurs during submission, the nearest +error.svelte page will be rendered.

enhance
We can customize what happens when the form is submitted with the enhance method:

src/routes/blog/new/+page

<script lang="ts">
	import { createPost } from '../data.remote';
	import { showToast } from '$lib/toast';
</script>

<h1>Create a new post</h1>

<form {...createPost.enhance(async ({ form, data, submit }) => {
	try {
		await submit();
		form.reset();

		showToast('Successfully published!');
	} catch (error) {
		showToast('Oh no! Something went wrong');
	}
})}>
	<input name="title" />
	<textarea name="content"></textarea>
	<button>publish</button>
</form>
The callback receives the form element, the data it contains, and a submit function.

To enable client-driven single-flight mutations, use submit().updates(...). For example, if the getPosts() query was used on this page, we could refresh it like so:


await submit().updates(getPosts());
We can also override the current data while the submission is ongoing:


await submit().updates(
	getPosts().withOverride((posts) => [newPost, ...posts])
);
The override will be applied immediately, and released when the submission completes (or fails).

buttonProps
By default, submitting a form will send a request to the URL indicated by the <form> element’s action attribute, which in the case of a remote function is a property on the form object generated by SvelteKit.

It’s possible for a <button> inside the <form> to send the request to a different URL, using the formaction attribute. For example, you might have a single form that allows you to log in or register depending on which button was clicked.

This attribute exists on the buttonProps property of a form object:

src/routes/login/+page

<script lang="ts">
	import { login, register } from '$lib/auth';
</script>

<form {...login}>
	<label>
		Your username
		<input name="username" />
	</label>

	<label>
		Your password
		<input name="password" type="password" />
	</label>

	<button>login</button>
	<button {...register.buttonProps}>register</button>
</form>
Like the form object itself, buttonProps has an enhance method for customizing submission behaviour.

command
The command function, like form, allows you to write data to the server. Unlike form, it’s not specific to an element and can be called from anywhere.

Prefer form where possible, since it gracefully degrades if JavaScript is disabled or fails to load.

As with query, if the function accepts an argument, it should be validated by passing a Standard Schema as the first argument to command.

likes.remote

import * as v from 'valibot';
import { query, command } from '$app/server';
import * as db from '$lib/server/database';

export const getLikes = query(v.string(), async (id) => {
	const [row] = await db.sql`
		SELECT likes
		FROM item
		WHERE id = ${id}
	`;

	return row.likes;
});

export const addLike = command(v.string(), async (id) => {
	await db.sql`
		UPDATE item
		SET likes = likes + 1
		WHERE id = ${id}
	`;
});
Now simply call addLike, from (for example) an event handler:

+page

<script lang="ts">
	import { getLikes, addLike } from './likes.remote';
	import { showToast } from '$lib/toast';

	let { item } = $props();
</script>

<button
	onclick={async () => {
		try {
			await addLike(item.id);
		} catch (error) {
			showToast('Something went wrong!');
		}
	}}
>
	add like
</button>

<p>likes: {await getLikes(item.id)}</p>
Commands cannot be called during render.

Updating queries
To update getLikes(item.id), or any other query, we need to tell SvelteKit which queries need to be refreshed (unlike form, which by default invalidates everything, to approximate the behaviour of a native form submission).

We either do that inside the command itself...

likes.remote

export const getLikes = query(v.string(), async (id) => { /* ... */ });

export const addLike = command(v.string(), async (id) => {
	await db.sql`
		UPDATE item
		SET likes = likes + 1
		WHERE id = ${id}
	`;

	getLikes(id).refresh();
	// Just like within form functions you can also do
	// getLikes(id).set(...)
	// in case you have the result already
});
...or when we call it:


try {
	await addLike(item.id).updates(getLikes(item.id));
} catch (error) {
	showToast('Something went wrong!');
}
As before, we can use withOverride for optimistic updates:


try {
	await addLike(item.id).updates(
		getLikes(item.id).withOverride((n) => n + 1)
	);
} catch (error) {
	showToast('Something went wrong!');
}
prerender
The prerender function is similar to query, except that it will be invoked at build time to prerender the result. Use this for data that changes at most once per redeployment.

src/routes/blog/data.remote

import { prerender } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = prerender(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at
		DESC
	`;

	return posts;
});
You can use prerender functions on pages that are otherwise dynamic, allowing for partial prerendering of your data. This results in very fast navigation, since prerendered data can live on a CDN along with your other static assets.

In the browser, prerendered data is saved using the Cache API. This cache survives page reloads, and will be cleared when the user first visits a new deployment of your app.

When the entire page has export const prerender = true, you cannot use queries, as they are dynamic.

Prerender arguments
As with queries, prerender functions can accept an argument, which should be validated with a Standard Schema:

src/routes/blog/data.remote

import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = prerender(async () => { /* ... */ });

export const getPost = prerender(v.string(), async (slug) => {
	const [post] = await db.sql`
		SELECT * FROM post
		WHERE slug = ${slug}
	`;

	if (!post) error(404, 'Not found');
	return post;
});
Any calls to getPost(...) found by SvelteKit’s crawler while prerendering pages will be saved automatically, but you can also specify which values it should be called with using the inputs option:

src/routes/blog/data.remote

export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		inputs: () => [
			'first-post',
			'second-post',
			'third-post'
		]
	}
);
Svelte does not yet support asynchronous server-side rendering, so it’s likely that you’re only calling remote functions from the browser, rather than during prerendering. Because of this, you will need to use inputs, for now. We’re actively working on this roadblock.

By default, prerender functions are excluded from your server bundle, which means that you cannot call them with any arguments that were not prerendered. You can set dynamic: true to change this behaviour:

src/routes/blog/data.remote

export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		dynamic: true,
		inputs: () => [
			'first-post',
			'second-post',
			'third-post'
		]
	}
);
Handling validation errors
As long as you’re not passing invalid data to your remote functions, there are only two reasons why the argument passed to a command, query or prerender function would fail validation:

the function signature changed between deployments, and some users are currently on an older version of your app
someone is trying to attack your site by poking your exposed endpoints with bad data
In the second case, we don’t want to give the attacker any help, so SvelteKit will generate a generic 400 Bad Request response. You can control the message by implementing the handleValidationError server hook, which, like handleError, must return an App.Error (which defaults to { message: string }):

src/hooks.server

import type { HandleValidationError } from '@sveltejs/kit';

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
	return {
		message: 'Nice try, hacker!'
	};
};
If you know what you’re doing and want to opt out of validation, you can pass the string 'unchecked' in place of a schema:

data.remote

import { query } from '$app/server';

export const getStuff = query('unchecked', async ({ id }: { id: string }) => {
	// the shape might not actually be what TypeScript thinks
	// since bad actors might call this function with other arguments
});
form does not accept a schema since you are always passed a FormData object. You are free to parse and validate this as you see fit.

Using getRequestEvent
Inside query, form and command you can use getRequestEvent to get the current RequestEvent object. This makes it easy to build abstractions for interacting with cookies, for example:

user.remote

import { getRequestEvent, query } from '$app/server';
import { findUser } from '$lib/server/database';

export const getProfile = query(async () => {
	const user = await getUser();

	return {
		name: user.name,
		avatar: user.avatar
	};
});

// this function could be called from multiple places
function getUser() {
	const { cookies, locals } = getRequestEvent();

	locals.userPromise ??= findUser(cookies.get('session_id'));
	return await locals.userPromise;
}
Note that some properties of RequestEvent are different inside remote functions. There are no params or route.id, and you cannot set headers (other than writing cookies, and then only inside form and command functions), and url.pathname is always / (since the path that’s actually being requested by the client is purely an implementation detail).

Redirects
Inside query, form and prerender functions it is possible to use the redirect(...) function. It is not possible inside command functions, as you should avoid redirecting here. (If you absolutely have to, you can return a { redirect: location } object and deal with it in the client.)

 Edit this page on GitHub
