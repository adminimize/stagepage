# Remote Functions Migration Plan

## Overview

This plan outlines the migration from traditional SvelteKit load functions to the new remote functions pattern, leveraging SvelteKit's experimental remote functions, await syntax, and error boundaries.

## Current State Analysis

### Existing Architecture
- 25 `+page.server.ts` files across different routes
- Mix of traditional try/catch error handling and Effect library usage
- Inconsistent error handling patterns
- Server-side data loading with manual error management
- Directus client integration in `$lib/directus.ts`

### Current Patterns
1. **Basic Pattern**: Simple try/catch with fallback empty arrays
2. **Effect Pattern**: Using Effect library for functional error handling
3. **Complex Pattern**: Multi-step data loading with nested relationships

## Migration Strategy

### Phase 1: Foundation Setup ✅
- [x] Enable remote functions in `svelte.config.js`
- [x] Enable async compiler option
- [x] Create initial remote function example (`programs/data.remote.ts`)

### Phase 2: Core Data Services
Create centralized remote functions for each main collection:

#### 2.1 Collection-Level Remote Functions
Location: `src/lib/remote/` (centralized approach)

**Collections to migrate:**
- `programs.remote.ts`
- `productions.remote.ts`
- `festivals.remote.ts`
- `shows.remote.ts`
- `people.remote.ts`
- `organizations.remote.ts`
- `venues.remote.ts`
- `events.remote.ts`
- `songs.remote.ts`
- `cities.remote.ts`

#### 2.2 Route-Level Remote Functions
Alternative: Keep remote functions co-located with routes
Location: `src/routes/[collection]/data.remote.ts`

**Decision**: Start with route-level co-location for API-like organization, evaluate centralization later.

### Phase 3: Route Migration Priority

#### High Priority (Simple List Views)
1. `src/routes/festivals/+page.server.ts` → `data.remote.ts`
2. `src/routes/people/+page.server.ts` → `data.remote.ts`
3. `src/routes/shows/+page.server.ts` → `data.remote.ts`
4. `src/routes/organizations/+page.server.ts` → `data.remote.ts`
5. `src/routes/events/+page.server.ts` → `data.remote.ts`
6. `src/routes/songs/+page.server.ts` → `data.remote.ts`

#### Medium Priority (Complex Queries)
1. `src/routes/productions/+page.server.ts` → `data.remote.ts`
2. `src/routes/venues/+page.server.ts` → `data.remote.ts`
3. `src/routes/years/+page.server.ts` → `data.remote.ts`

#### High Priority (Detail Views)
1. `src/routes/programs/[id]/+page.server.ts` → `data.remote.ts`
2. `src/routes/productions/[id]/+page.server.ts` → `data.remote.ts`
3. Individual detail pages for other collections

#### Low Priority (Specialized Views)
1. City-based production listings
2. Venue-based production listings
3. Year-based listings

### Phase 4: Error Handling & Boundaries

#### 4.1 Standardized Error Types
Create domain-specific error types using Effect:
```typescript
// src/lib/errors/directus.ts
export class DirectusConnectionError extends Data.TaggedError("DirectusConnectionError")
export class CollectionNotFoundError extends Data.TaggedError("CollectionNotFoundError")
export class ItemNotFoundError extends Data.TaggedError("ItemNotFoundError")
```

#### 4.2 Component Error Boundaries
Update all components to use `<svelte:boundary>` with:
- `pending` snippets for loading states
- `failed` snippets for error states
- Consistent error UI patterns

### Phase 5: Advanced Features

#### 5.1 Optimistic Updates
Implement optimistic updates for:
- Form submissions
- Real-time data changes
- User interactions

#### 5.2 Caching Strategy
- Implement query caching patterns
- Use `prerender` for static data
- Cache invalidation strategies

#### 5.3 Single-Flight Mutations
Implement efficient form handling with targeted query refreshes

## Implementation Details

### Remote Function Patterns

#### Pattern 1: Simple Collection Query
```typescript
// src/routes/festivals/data.remote.ts
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItems } from '@directus/sdk';

export const getFestivals = query(async () => {
    const directus = await createDirectusClient();
    return await directus.request(
        readItems('festivals', {
            fields: ['*', 'productions.*'],
            sort: ['start_date']
        })
    );
});
```

#### Pattern 2: Parameterized Query
```typescript
// src/routes/programs/data.remote.ts
import * as v from 'valibot';
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';
import { readItem } from '@directus/sdk';

export const getProgram = query(v.string(), async (id) => {
    const directus = await createDirectusClient();
    const program = await directus.request(
        readItem('programs', id, {
            fields: [
                '*',
                'production.*',
                'festival.*',
                'credits.*.*.*'
            ]
        })
    );
    
    if (!program) {
        throw error(404, 'Program not found');
    }
    
    return program;
});
```

#### Pattern 3: Complex Multi-Step Query
```typescript
// src/routes/programs/data.remote.ts
export const getProgramWithSections = query(v.string(), async (id) => {
    const directus = await createDirectusClient();
    
    const program = await directus.request(
        readItem('programs', id, {
            fields: ['*', 'sections.*']
        })
    );
    
    // Load section content dynamically
    const sectionsWithData = await Promise.all(
        program.sections?.map(async (section) => {
            const content = await directus.request(
                readItem(section.collection, section.item, {
                    fields: ['*.*.*']
                })
            );
            return { ...section, content };
        }) || []
    );
    
    return { ...program, sectionsWithData };
});
```

### Component Updates

#### Before (Load Function)
```svelte
<script>
    let { data } = $props();
</script>

<ul>
    {#each data.programs as program}
        <li>{program.title}</li>
    {/each}
</ul>
```

#### After (Remote Function)
```svelte
<script>
    import { getPrograms } from './data.remote';
</script>

<svelte:boundary>
    <ul>
        {#each await getPrograms() as program}
            <li>{program.title}</li>
        {/each}
    </ul>
    
    {#snippet pending()}
        <div class="loading">Loading programs...</div>
    {/snippet}
    
    {#snippet failed(error, reset)}
        <div class="error">
            <p>Failed to load programs</p>
            <button onclick={reset}>Try again</button>
        </div>
    {/snippet}
</svelte:boundary>
```

## File Organization Strategy

### Option A: Route Co-location (Recommended)
```
src/routes/
├── programs/
│   ├── data.remote.ts
│   ├── +page.svelte
│   └── [id]/
│       ├── data.remote.ts
│       └── +page.svelte
├── productions/
│   ├── data.remote.ts
│   └── +page.svelte
```

### Option B: Centralized Services
```
src/lib/
├── remote/
│   ├── programs.remote.ts
│   ├── productions.remote.ts
│   └── festivals.remote.ts
```

**Decision**: Start with Option A for API-like organization, evaluate Option B for shared functions.

## Effect Library Integration

### Server-Side Error Handling
```typescript
import { Effect, pipe } from 'effect';
import { query } from '$app/server';

export const getProductions = query(async () => {
    return Effect.runPromise(
        pipe(
            Effect.tryPromise(() => createDirectusClient()),
            Effect.flatMap((directus) =>
                Effect.tryPromise(() =>
                    directus.request(readItems('productions'))
                )
            ),
            Effect.catchAll((error) => {
                Console.error('Failed to load productions:', error);
                return Effect.succeed([]);
            })
        )
    );
});
```

## Migration Checklist

### Per Route Migration
- [ ] Create `data.remote.ts` file
- [ ] Migrate query logic from `+page.server.ts`
- [ ] Add proper validation schemas
- [ ] Implement Effect error handling
- [ ] Update component to use remote function
- [ ] Add error boundary with pending/failed snippets
- [ ] Test error scenarios
- [ ] Remove old `+page.server.ts` file

### Global Tasks
- [ ] Create shared error types
- [ ] Establish consistent loading UI patterns
- [ ] Create reusable error boundary components
- [ ] Update documentation
- [ ] Performance testing
- [ ] Error monitoring setup

## Timeline Estimate

- **Phase 1**: Complete ✅
- **Phase 2**: 2-3 days (core remote functions)
- **Phase 3**: 1-2 weeks (route migrations)
- **Phase 4**: 3-4 days (error handling)
- **Phase 5**: 1 week (advanced features)

**Total**: 3-4 weeks for complete migration

## Success Metrics

1. **Performance**: Faster perceived loading with pending states
2. **DX**: Cleaner component code with co-located data fetching
3. **UX**: Better error handling and recovery
4. **Maintainability**: Consistent patterns across all routes
5. **Type Safety**: Full TypeScript integration with validation

## Next Steps

1. Begin with high-priority simple list views
2. Create shared error boundary components
3. Establish testing patterns for remote functions
4. Document patterns for team adoption
5. Monitor performance and user experience improvements
