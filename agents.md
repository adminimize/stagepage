# StagePage Data Model Guide for Frontend Development

## 🎭 Overview

StagePage is a digital playbill system for theater festivals and productions. The data model supports complex hierarchical relationships between festivals, productions, shows, people, and events.

## 🛠️ Technical Stack

### Server-Side Code Standards
- **Effect Library**: All server-side code uses the Effect standard library (not the Svelte feature) for handling asynchronous operations, error management, and side effects
- **No try/catch blocks**: Replace traditional try/catch with Effect's type-safe error handling
- **Structured logging**: Use Effect's Console module instead of console.log
- **Functional composition**: Leverage Effect's pipe and composition patterns

## 🏗️ Data Architecture

### Core Content Hierarchy

```
Festivals (IMPACT 25)
  ├── Productions (The Seventh Fire - IMPACT 25)
  │   ├── Shows (The Seventh Fire)
  │   ├── Programs (Digital Playbill)
  │   └── Events (Specific Performances)
  └── Programs (Festival-wide program)
```

### Key Relationships

- **Festival** → Many **Productions** → Many **Programs** → Many **Events**
- **Shows** are abstract works that can have multiple **Productions**
- **People** connect to everything via junction tables with roles
- **Organizations** can co-produce **Productions**

## 📊 Collection Reference

### Content Collections

#### `festivals`
International theater festivals and events.
```js
{
  id: "uuid",
  title: "IMPACT 25",
  slug: "impact-25",
  description: "International festival...",
  start_date: "2025-09-22",
  end_date: "2025-09-27",
  year: 2025,
  location: "Vancouver, BC",
  website: "https://example.com"
}
```

#### `productions`
Specific mountings of theatrical works.
```js
{
  id: "uuid",
  title: "The Music Man - 2024 Summer Revival",
  slug: "music-man-2024-summer",
  opening_date: "2024-07-15",
  closing_date: "2024-08-31",
  description: "Classic musical revival...",
  // Relationships
  show: "show_uuid",
  organizations: ["org1_uuid", "org2_uuid"],
  festivals: ["festival_uuid"]
}
```

#### `shows`
Abstract theatrical works that can be produced multiple times.
```js
{
  id: "uuid",
  title: "The Music Man",
  slug: "the-music-man",
  description: "Musical by Meredith Willson...",
  playwright: "Meredith Willson"
}
```

#### `programs`
Published program documents (digital playbills).
```js
{
  id: "uuid",
  title: "The Music Man Program",
  slug: "music-man-program",
  published_date: "2024-07-01",
  // Relationships
  production: "production_uuid",
  festivals: ["festival_uuid"]
}
```

#### `events`
Specific performances with timing and venue details.
```js
{
  id: "uuid",
  title: "Opening Night",
  start: "2024-07-15T19:30:00",
  end: "2024-07-15T22:00:00",
  special_notes: "Opening night reception follows",
  understudy_notes: "Jane Smith as Marian",
  // Relationships
  venue: "venue_uuid",
  programs: ["program_uuid"]
}
```

### People & Organizations

#### `people`
Theater community members with profiles.
```js
{
  id: "uuid",
  full_name: "Lin-Manuel Miranda",
  stage_name: "Lin-Manuel Miranda",
  default_bio: "Tony Award-winning composer...",
  headshot: "file_uuid",
  website: "https://example.com",
  pronouns: ["he", "him", "his"],
  // Relationship to directus_users for login
  user: "user_uuid"
}
```

#### `organizations`
Theater companies and institutions.
```js
{
  id: "uuid",
  name: "Neworld Theatre",
  website: "https://neworldtheatre.com",
  charity_status: "Non-profit",
  is_active: true,
  logo: "file_uuid"
}
```

### Location & Venues

#### `venues`
Performance spaces.
```js
{
  id: "uuid",
  name: "Queen Elizabeth Theatre",
  capacity: 2765,
  venue_type: "Theater",
  address: "address_uuid"
}
```

#### `addresses`
Canada Post compatible addresses.
```js
{
  id: "uuid",
  street_address: "630 Hamilton St",
  line_2: "Suite 100", // Optional
  postal_code: "V6B 5N6",
  country: "CA",
  city: "city_uuid"
}
```

#### `cities`
City data with province/state.
```js
{
  id: "uuid",
  name: "Vancouver",
  province: "BC",
  country: "CA"
}
```

## 🔗 Junction Tables & Credits

### Credit System Overview
Credits are tracked at multiple levels using junction tables. This allows:
- Show-level creative team (writers, composers)
- Production-level credits (directors, designers for specific mounting)
- Program-level cast and crew (performers, specific roles)
- Song-level credits (composers, lyricists per song)

### Junction Tables

#### `programs_people`
Program-level credits (cast, crew, featured artists).
```js
{
  programs_id: "program_uuid",
  people_id: "person_uuid",
  role: "role_uuid", // Links to roles table
  role_name_override: "Harold Hill", // Override role name
  bio_override: "Special bio for this production",
  billing_order: 1,
  is_featured: true
}
```

#### `productions_people`
Production-specific credits.
```js
{
  productions_id: "production_uuid",
  people_id: "person_uuid",
  role: "role_uuid"
}
```

#### `shows_people`
Show-level creative team.
```js
{
  shows_id: "show_uuid",
  people_id: "person_uuid",
  role_type: "Composer" // Direct string for creative roles
}
```

#### `songs_people`
Song-specific credits.
```js
{
  songs_id: "song_uuid",
  people_id: "person_uuid",
  roles: "role_uuid"
}
```

## 🪄 The Magic Query Pattern

### Single Query for Complete Program Data

The system's power comes from being able to fetch all related data in one API call:

```js
// Fetch complete program with all relationships
const programData = await directus.items('programs').readOne(programId, {
  fields: [
    '*', // All program fields
    'production.*', // Production details
    'production.show.*', // Show information
    'production.organizations.*', // Co-producing orgs
    'festivals.*', // Festival context
    'events.*', // All performance events
    'events.venue_id.*', // Venue details for each event
    'events.venue_id.address.*', // Full address
    'events.venue_id.address.city.*', // City/province
    'credits.*', // All program credits
    'credits.people_id.*', // Full person details
    'credits.people_id.pronouns.*', // Pronoun preferences
    'credits.role.*', // Role information
    'songs.*', // All songs in program
    'songs.credits.*', // Song credits
    'songs.credits.people_id.*' // Song credit person details
  ]
});
```

### Deep Nested Syntax

Use dot notation to traverse relationships:
- `production.show.title` - Show title through production
- `credits.people_id.full_name` - Person name through credits
- `events.venue_id.address.city.name` - City name through venue
- `festivals.title` - Festival title (if program belongs to festival)

### Wildcard Usage

- `*` - All fields at current level
- `credits.*` - All fields in credits junction table
- `credits.people_id.*` - All person fields through credits

## 🎯 Frontend Implementation Strategies

### 1. Virtual Program Concept

Programs can represent:
- **Production-specific programs** - Traditional playbill for one show
- **Festival-wide programs** - Umbrella document covering multiple productions
- **Event-specific programs** - Special materials for galas, opening nights

### 2. Credit Aggregation

When displaying credits, merge from multiple levels:
1. Start with show-level creative team
2. Add production-level credits (directors, designers)
3. Include program-level cast and crew
4. Handle conflicts with billing_order

### 3. Bio Management

People can have:
- `default_bio` - Standard bio
- `bio_override` in junction tables - Context-specific bio
- Priority: junction bio_override > default_bio

### 4. Role Name Flexibility

Roles can be:
- **Global roles** - Reusable (Director, Choreographer)
- **Show-specific roles** - Character names (Harold Hill, Marian Paroo)
- **Overrideable** - Use `role_name_override` for variations

## 🔄 Common Query Patterns

### Get Festival with All Productions
```js
const festival = await directus.items('festivals').readOne(festivalId, {
  fields: ['*', 'productions.*', 'productions.show.*', 'programs.*']
});
```

### Get Production with Complete Cast
```js
const production = await directus.items('productions').readOne(productionId, {
  fields: [
    '*',
    'show.*',
    'credits.*',
    'credits.people_id.*',
    'credits.role.*',
    'programs.*',
    'programs.credits.*',
    'programs.credits.people_id.*'
  ]
});
```

### Get Person with All Credits
```js
const person = await directus.items('people').readOne(personId, {
  fields: [
    '*',
    'programs.*',
    'programs.production.*',
    'productions.*', 
    'shows.*',
    'songs.*'
  ]
});
```

## 🚀 Performance Tips

1. **Use specific field lists** - Don't always use `*` in production
2. **Limit nested depth** - Only fetch what you need
3. **Cache program data** - Programs change infrequently
4. **Pagination for lists** - Use `limit` and `offset` for large datasets
5. **Filter at API level** - Use Directus filters rather than client-side filtering

## 🎯 Effect Patterns for Server Code

### Domain-Driven Error Types
Instead of generic Error objects, create domain-specific error types:

```typescript
import { Data } from 'effect';

// Tagged error types that represent business domain failures
export class ItemNotFoundError extends Data.TaggedError("ItemNotFoundError")<{
  readonly collection: string;
  readonly id: string;
}> {}

export class InvalidParametersError extends Data.TaggedError("InvalidParametersError")<{
  readonly message: string;
}> {}

export class CollectionFetchError extends Data.TaggedError("CollectionFetchError")<{
  readonly collection: string;
  readonly details: string;
}> {}
```

### Service-Based Architecture with Context
Use Effect's Context system for dependency injection:

```typescript
import { Effect, Layer, Context } from 'effect';

// Define a service
export class DirectusService extends Context.Tag("DirectusService")<
  DirectusService,
  { readonly client: any }
>() {}

// Create the service layer
export const DirectusServiceLive = Layer.effect(
  DirectusService,
  Effect.promise(() => createDirectusClient()).pipe(
    Effect.map((client) => ({ client }))
  )
);

// Use the service
const fetchData = pipe(
  Effect.flatMap(DirectusService, ({ client }) => 
    Effect.tryPromise({
      try: () => client.request(/* ... */),
      catch: (error) => new CollectionFetchError({ /* ... */ })
    })
  )
);
```

### Clean Page Loaders
```typescript
import { Effect, pipe } from 'effect';

const getProductions = pipe(
  fetchProductions(),
  Effect.map((productions) => ({ productions })),
  // Handle specific error types with user-friendly messages
  Effect.catchTags({
    DirectusConnectionError: () => 
      Effect.succeed({ productions: [], error: 'Data temporarily unavailable' }),
    CollectionFetchError: () => 
      Effect.succeed({ productions: [], error: 'Productions could not be loaded' })
  })
);

export const load = async () => runWithDirectus(getProductions);
```

### Effect Type Signatures
The real power of Effect is in type signatures that tell the complete story:

```typescript
// ❌ Traditional - no error information in types
const fetchUser = (id: string): Promise<User>

// ✅ Effect - complete information in types
const fetchUser = (id: string): Effect<User, ItemNotFoundError | ValidationError, DatabaseService>
//                                      ↑      ↑                                    ↑
//                                   Success  All possible errors              Required services
```

### Key Principles
1. **Errors as Values**: Model domain failures as data, not exceptions
2. **Type-Driven Development**: Let the type system guide your error handling
3. **Composition Over Coordination**: Build complex operations by composing simple effects
4. **Services Not Globals**: Use Context for dependency injection
5. **Explicit Resource Management**: Track what your code needs to run

## 🔮 Future Considerations

### Override Fields to Add
- `understudy_tracking` in junction tables
- `performance_specific_cast` for events
- `bio_approval_status` for editorial workflow
- `credit_type` categories (cast, creative, crew, featured)

### Billing Order Strategy
- Define clear precedence rules
- Handle conflicts when same person has multiple roles
- Support custom ordering per context

This system provides maximum flexibility while maintaining data integrity and supporting complex theater production workflows.