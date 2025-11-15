# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run preview            # Build and preview with Wrangler

# Testing
npm run test               # Run all tests (unit + e2e)
npm run test:unit          # Run unit tests with Vitest
npm run test:e2e           # Run end-to-end tests with Playwright
npm run test:unit -- path/to/test.ts  # Run single test file

# Code Quality
npm run lint               # Run Prettier check and ESLint
npm run format             # Format code with Prettier
npm run check              # Type check with svelte-check
npm run check:watch        # Type check in watch mode

# Type Generation
npm run types:generate     # Generate TypeScript types from Directus OpenAPI spec
npm run cf-typegen         # Generate Cloudflare Worker types

# Deployment
npm run deploy             # Build and deploy to Cloudflare Workers
```

## Project Overview

StagePage is a digital playbill system for theater festivals and productions. It manages complex hierarchical relationships between festivals, productions, shows, people, and events to create comprehensive digital programs.

## Tech Stack

- **Frontend**: SvelteKit 2 with Svelte 5, TailwindCSS 4
- **Backend**: Cloudflare Workers with SvelteKit adapter
- **CMS**: Directus headless CMS with TypeScript type generation via openapi-typescript
- **Error Handling**: Effect library for functional error handling
- **Testing**: Vitest (unit), Playwright (e2e)

## Architecture

### Code Organization

- `src/lib/directus.ts` - Directus client and typed API helper functions
- `src/lib/types/directus.ts` - Auto-generated types from Directus OpenAPI spec
- `src/lib/types/index.ts` - Clean exports and utility types
- `src/routes/**/+page.server.ts` - SvelteKit server load functions
- `src/hooks.server.ts` - SvelteKit server hooks (auth placeholder)
- `scripts/generate-types.sh` - Type generation workflow
- `scripts/fix-openapi-spec.js` - Fixes broken Directus OpenAPI references

### Server-Side Patterns

Server load functions use Effect library for error handling:

```typescript
export const load = async ({ params }) => {
  return Effect.runPromise(
    Effect.gen(function* () {
      const directus = yield* Effect.tryPromise(() => createDirectusClient());
      const data = yield* Effect.tryPromise(() => directus.request(...));
      return { data };
    }).pipe(
      Effect.catchAll((err) => {
        Console.error('Error:', err);
        throw error(404, 'Not found');
      })
    )
  );
};
```

**Critical**: Use Effect library for all server-side code - no try/catch, no console.log

### Directus Integration

The project uses Directus SDK with typed helpers. Types are generated from the Directus OpenAPI spec:

1. Download spec from `http://localhost:4343/server/specs/oas`
2. Fix broken references with `scripts/fix-openapi-spec.js`
3. Generate types with `openapi-typescript`

Use the typed helper functions in `src/lib/directus.ts` for common operations.

## Data Architecture

### Core Content Hierarchy
```
Festivals (IMPACT 25)
  ├── Productions (The Seventh Fire - IMPACT 25)
  │   ├── Shows (The Seventh Fire)
  │   ├── Programs (Digital Playbill)
  │   └── Events (Specific Performances)
  └── Programs (Festival-wide program)
```

### Key Collections
- **festivals** - International theater festivals and events
- **productions** - Specific mountings of theatrical works
- **shows** - Abstract theatrical works that can be produced multiple times
- **programs** - Published program documents (digital playbills)
- **events** - Specific performances with timing and venue details
- **people** - Theater community members with profiles
- **organizations** - Theater companies and institutions
- **venues** - Performance spaces

### Credit System
Credits are tracked at multiple levels using junction tables:
- Show-level creative team (writers, composers)
- Production-level credits (directors, designers for specific mounting)
- Program-level cast and crew (performers, specific roles)
- Song-level credits (composers, lyricists per song)

### Directus Query Patterns

Fetch nested relational data using the fields array:

```typescript
readItems('festivals', {
  fields: [
    'id', 'name', 'slug',
    'productions.productions_id.title',
    'productions.productions_id.show.shows_id.title',
    'organizations.organizations_id.name'
  ]
})
```

## Code Style

- **Effect Library**: Use Effect for all server-side code (no try/catch, no console.log)
- **Imports**: Use `$lib` aliases for internal imports
- **Types**: Strict TypeScript, use generated Directus types
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Components**: Svelte 5 runes, TailwindCSS 4 for styling
- **NO EMOJIS**: Never use emojis in the UI - keep the design clean and text-based
- **Design Philosophy**: Charmingly slightly old but super clean - no modern AI UI patterns like thick accent borders

## Environment Variables

- `PUBLIC_DIRECTUS_URL` - Directus API endpoint (required)
- `DATABASE_URL` - PostgreSQL connection string (legacy, may be removed)

## Dark Mode

Dark mode is implemented using Tailwind's class-based dark mode strategy:

- Toggle component: `src/lib/components/DarkModeToggle.svelte`
- Persisted to localStorage and respects system preference
- Use `dark:` variants for all color-related styles
- Keep the aesthetic consistent - clean, slightly old-fashioned, professional

## Important Notes

- Current auth system in `src/hooks.server.ts` is placeholder code - ignore for now
- Programs can be production-specific, festival-wide, or event-specific
- Credit aggregation merges data from multiple levels (show → production → program)