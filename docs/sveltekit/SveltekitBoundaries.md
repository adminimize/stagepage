SvelteSpecial elements
<svelte:boundary>
On this page
<svelte:boundary>
Properties

<svelte:boundary onerror={handler}>...</svelte:boundary>
This feature was added in 5.3.0

Boundaries allow you to ‘wall off’ parts of your app, so that you can:

provide UI that should be shown when await expressions are first resolving
handle errors that occur during rendering or while running effects, and provide UI that should be rendered when an error happens
If a boundary handles an error (with a failed snippet or onerror handler, or both) its existing content will be removed.

Errors occurring outside the rendering process (for example, in event handlers or after a setTimeout or async work) are not caught by error boundaries.

Properties
For the boundary to do anything, one or more of the following must be provided.

pending
As of Svelte 5.36, boundaries with a pending snippet can contain await expressions. This snippet will be shown when the boundary is first created, and will remain visible until all the await expressions inside the boundary have resolved (demo):


<svelte:boundary>
	<p>{await delayed('hello!')}</p>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
The pending snippet will not be shown for subsequent async updates — for these, you can use $effect.pending().

In the playground, your app is rendered inside a boundary with an empty pending snippet, so that you can use await without having to create one.

failed
If a failed snippet is provided, it will be rendered when an error is thrown inside the boundary, with the error and a reset function that recreates the contents (demo):


<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
As with snippets passed to components, the failed snippet can be passed explicitly as a property...


<svelte:boundary {failed}>...</svelte:boundary>
...or implicitly by declaring it directly inside the boundary, as in the example above.

onerror
If an onerror function is provided, it will be called with the same two error and reset arguments. This is useful for tracking the error with an error reporting service...


<svelte:boundary onerror={(e) => report(e)}>
	...
</svelte:boundary>
...or using error and reset outside the boundary itself:


<script>
	let error = $state(null);
	let reset = $state(() => {});

	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>
		oops! try again
	</button>
{/if}
If an error occurs inside the onerror function (or if you rethrow the error), it will be handled by a parent boundary if such exists.