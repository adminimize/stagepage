# Remote Function Examples

This document provides concrete examples of remote function patterns for the StagePage application, demonstrating different approaches for various data fetching scenarios.

## Basic Collection Queries

### Simple List Query
```typescript
// src/routes/festivals/data.remote.ts
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getFestivals = query(async () => {
    const directus = await createDirectusClient();
    return await directus.request(
        readItems('festivals', {
            fields: ['*', 'productions.id', 'productions.title'],
            sort: ['start_date', 'title']
        })
    );
});
```

### Filtered Collection Query
```typescript
// src/routes/productions/data.remote.ts
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getPublishedProductions = query(async () => {
    const directus = await createDirectusClient();
    return await directus.request(
        readItems('productions', {
            fields: [
                'id', 'title', 'slug', 'description',
                'show.shows_id.title',
                'festivals.festivals_id.name',
                'organizations.organizations_id.name',
                'events.start', 'events.end'
            ],
            filter: {
                status: { _eq: 'published' }
            },
            sort: ['-date_created', 'title']
        })
    );
});
```

## Parameterized Queries

### Single Item with Validation
```typescript
// src/routes/programs/data.remote.ts
import * as v from 'valibot';
import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const getProgram = query(v.string(), async (id) => {
    const directus = await createDirectusClient();
    
    const program = await directus.request(
        readItem('programs', id, {
            fields: [
                '*',
                'production.*',
                'production.show.*',
                'festival.*',
                'events.*',
                'events.venue.*',
                'credits.*.*.*'
            ]
        })
    );
    
    if (!program) {
        error(404, 'Program not found');
    }
    
    return program;
});
```

### Complex Parameter Validation
```typescript
// src/routes/cities/data.remote.ts
import * as v from 'valibot';
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

const CityProductionsSchema = v.object({
    city: v.string(),
    year: v.optional(v.number()),
    status: v.optional(v.union([
        v.literal('published'),
        v.literal('draft'),
        v.literal('archived')
    ]))
});

export const getCityProductions = query(CityProductionsSchema, async (params) => {
    const directus = await createDirectusClient();
    
    const filter = {
        'events.venue.venues_id.address.city.name': { _eq: params.city }
    };
    
    if (params.year) {
        filter['events.start'] = {
            _gte: `${params.year}-01-01`,
            _lt: `${params.year + 1}-01-01`
        };
    }
    
    if (params.status) {
        filter['status'] = { _eq: params.status };
    }
    
    return await directus.request(
        readItems('productions', {
            fields: [
                'id', 'title', 'slug',
                'show.shows_id.title',
                'events.start', 'events.end',
                'events.venue.venues_id.name',
                'events.venue.venues_id.address.city.name'
            ],
            filter
        })
    );
});
```

## Effect Library Integration

### Effect-Based Error Handling
```typescript
// src/routes/productions/data.remote.ts
import { Effect, pipe, Console } from 'effect';
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getProductionsWithEffect = query(async () => {
    return Effect.runPromise(
        pipe(
            Console.log('Loading productions...'),
            Effect.flatMap(() => Effect.tryPromise(() => createDirectusClient())),
            Effect.flatMap((directus) =>
                Effect.tryPromise(() =>
                    directus.request(
                        readItems('productions', {
                            fields: [
                                'id', 'title', 'slug', 'description',
                                'show.shows_id.title',
                                'festivals.festivals_id.name'
                            ],
                            filter: { status: { _eq: 'published' } },
                            sort: ['-date_created']
                        })
                    )
                )
            ),
            Effect.tap((productions) => 
                Console.log(`Loaded ${productions.length} productions`)
            ),
            Effect.catchAll((error) => {
                Console.error('Failed to load productions:', error);
                return Effect.succeed([]);
            })
        )
    );
});
```

### Domain-Specific Error Types
```typescript
// src/lib/errors/directus.ts
import { Data } from 'effect';

export class DirectusConnectionError extends Data.TaggedError("DirectusConnectionError")<{
    readonly message: string;
    readonly cause?: unknown;
}> {}

export class CollectionNotFoundError extends Data.TaggedError("CollectionNotFoundError")<{
    readonly collection: string;
}> {}

export class ItemNotFoundError extends Data.TaggedError("ItemNotFoundError")<{
    readonly collection: string;
    readonly id: string;
}> {}

// Usage in remote function
import { Effect, pipe } from 'effect';
import { DirectusConnectionError, ItemNotFoundError } from '$lib/errors/directus';

export const getProgramSafe = query(v.string(), async (id) => {
    return Effect.runPromise(
        pipe(
            Effect.tryPromise({
                try: () => createDirectusClient(),
                catch: (error) => new DirectusConnectionError({ 
                    message: 'Failed to connect to Directus',
                    cause: error 
                })
            }),
            Effect.flatMap((directus) =>
                Effect.tryPromise({
                    try: () => directus.request(readItem('programs', id)),
                    catch: (error) => new ItemNotFoundError({ 
                        collection: 'programs', 
                        id 
                    })
                })
            ),
            Effect.catchTags({
                DirectusConnectionError: () => Effect.succeed(null),
                ItemNotFoundError: () => Effect.succeed(null)
            })
        )
    );
});
```

## Complex Multi-Step Queries

### Program with Dynamic Sections
```typescript
// src/routes/programs/data.remote.ts
export const getProgramWithSections = query(v.string(), async (id) => {
    const directus = await createDirectusClient();
    
    // First, get the program with sections metadata
    const program = await directus.request(
        readItem('programs', id, {
            fields: [
                '*',
                'production.*',
                'festival.*',
                'sections.*'
            ]
        })
    );
    
    if (!program) {
        error(404, 'Program not found');
    }
    
    // Then, load each section's actual content
    const sectionsWithData = await Promise.all(
        (program.sections || []).map(async (section) => {
            try {
                const content = await directus.request(
                    readItem(section.collection, section.item, {
                        fields: ['*.*.*']
                    })
                );
                return { ...section, content };
            } catch (error) {
                console.warn(`Failed to load section ${section.collection}:${section.item}`, error);
                return { ...section, content: null };
            }
        })
    );
    
    return {
        ...program,
        sectionsWithData
    };
});
```

### Aggregated Data Query
```typescript
// src/routes/years/data.remote.ts
export const getYearStatistics = query(v.number(), async (year) => {
    const directus = await createDirectusClient();
    
    const [productions, events, festivals] = await Promise.all([
        // Productions in this year
        directus.request(
            readItems('productions', {
                fields: ['id', 'title', 'festivals.festivals_id.name'],
                filter: {
                    'events.start': {
                        _gte: `${year}-01-01`,
                        _lt: `${year + 1}-01-01`
                    }
                }
            })
        ),
        
        // Events in this year
        directus.request(
            readItems('events', {
                fields: ['id', 'title', 'start', 'venue.venues_id.name'],
                filter: {
                    start: {
                        _gte: `${year}-01-01`,
                        _lt: `${year + 1}-01-01`
                    }
                },
                sort: ['start']
            })
        ),
        
        // Festivals in this year
        directus.request(
            readItems('festivals', {
                fields: ['id', 'name', 'start_date', 'end_date'],
                filter: {
                    year: { _eq: year }
                }
            })
        )
    ]);
    
    return {
        year,
        productions,
        events,
        festivals,
        stats: {
            totalProductions: productions.length,
            totalEvents: events.length,
            totalFestivals: festivals.length
        }
    };
});
```

## Form Handling Examples

### Simple Form Submission
```typescript
// src/routes/programs/data.remote.ts
import { form } from '$app/server';
import * as auth from '$lib/server/auth';

export const createProgram = form(async (data) => {
    // Check authentication
    const user = await auth.getUser();
    if (!user) error(401, 'Unauthorized');
    
    // Validate form data
    const title = data.get('title');
    const description = data.get('description');
    
    if (typeof title !== 'string' || !title.trim()) {
        error(400, 'Title is required');
    }
    
    const directus = await createDirectusClient();
    
    const program = await directus.request(
        createItem('programs', {
            title: title.trim(),
            description: description?.toString() || '',
            status: 'draft'
        })
    );
    
    // Refresh the programs list
    await getPrograms().refresh();
    
    redirect(303, `/programs/${program.id}`);
});
```

### Command for Interactive Updates
```typescript
// src/routes/programs/data.remote.ts
import { command } from '$app/server';

export const toggleProgramStatus = command(
    v.object({
        id: v.string(),
        status: v.union([
            v.literal('draft'),
            v.literal('published'),
            v.literal('archived')
        ])
    }),
    async ({ id, status }) => {
        const directus = await createDirectusClient();
        
        await directus.request(
            updateItem('programs', id, { status })
        );
        
        // Refresh the specific program query
        getProgram(id).refresh();
    }
);
```

## Component Usage Examples

### Basic List with Error Boundary
```svelte
<!-- src/routes/festivals/+page.svelte -->
<script>
    import { getFestivals } from './data.remote';
</script>

<h1>Festivals</h1>

<svelte:boundary>
    <div class="festivals-grid">
        {#each await getFestivals() as festival}
            <div class="festival-card">
                <h2>{festival.title}</h2>
                <p>{festival.location}</p>
                <p>{festival.start_date} - {festival.end_date}</p>
            </div>
        {/each}
    </div>
    
    {#snippet pending()}
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading festivals...</p>
        </div>
    {/snippet}
    
    {#snippet failed(error, reset)}
        <div class="error-state">
            <h3>Unable to load festivals</h3>
            <p>Please check your connection and try again.</p>
            <button onclick={reset} class="retry-btn">
                Retry
            </button>
        </div>
    {/snippet}
</svelte:boundary>
```

### Detail View with Parameters
```svelte
<!-- src/routes/programs/[id]/+page.svelte -->
<script>
    import { getProgram } from './data.remote';
    
    let { params } = $props();
</script>

<svelte:boundary>
    {#await getProgram(params.id) then program}
        <article class="program">
            <h1>{program.title}</h1>
            
            {#if program.production}
                <h2>Production: {program.production.title}</h2>
            {/if}
            
            {#if program.festival}
                <p>Part of {program.festival.name}</p>
            {/if}
            
            {#if program.credits?.length}
                <section class="credits">
                    <h3>Credits</h3>
                    {#each program.credits as credit}
                        <div class="credit">
                            <strong>{credit.people_id.full_name}</strong>
                            <span>{credit.role.name}</span>
                        </div>
                    {/each}
                </section>
            {/if}
        </article>
    {/await}
    
    {#snippet pending()}
        <div class="program-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-content"></div>
        </div>
    {/snippet}
    
    {#snippet failed(error, reset)}
        <div class="error-state">
            <h2>Program not found</h2>
            <p>The program you're looking for doesn't exist or couldn't be loaded.</p>
            <a href="/programs">← Back to programs</a>
        </div>
    {/snippet}
</svelte:boundary>
```

### Interactive Form
```svelte
<!-- src/routes/programs/new/+page.svelte -->
<script>
    import { createProgram } from '../data.remote';
</script>

<h1>Create New Program</h1>

<form {...createProgram}>
    <label>
        <span>Title</span>
        <input name="title" required />
    </label>
    
    <label>
        <span>Description</span>
        <textarea name="description"></textarea>
    </label>
    
    <button type="submit">Create Program</button>
</form>

{#if createProgram.result?.success}
    <div class="success-message">
        Program created successfully!
    </div>
{/if}
```

## Prerender Examples

### Static Data
```typescript
// src/routes/about/data.remote.ts
import { prerender } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getOrganizations = prerender(async () => {
    const directus = await createDirectusClient();
    return await directus.request(
        readItems('organizations', {
            fields: ['id', 'name', 'website', 'logo'],
            filter: { is_active: { _eq: true } },
            sort: ['name']
        })
    );
});
```

### Prerender with Dynamic Fallback
```typescript
// src/routes/shows/data.remote.ts
export const getPopularShows = prerender(
    async () => {
        const directus = await createDirectusClient();
        return await directus.request(
            readItems('shows', {
                fields: ['id', 'title', 'slug', 'description'],
                filter: { featured: { _eq: true } },
                limit: 10
            })
        );
    },
    {
        dynamic: true, // Allow fallback to server rendering
        inputs: () => [] // No parameters for this query
    }
);
```

These examples demonstrate the full range of remote function patterns needed for the StagePage application, from simple queries to complex multi-step operations with proper error handling.
