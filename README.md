# StagePage

A digital playbill system for theater festivals and productions built with SvelteKit, featuring modern remote functions and error boundaries.

## Features

- Modern SvelteKit 2 application with Svelte 5
- **Remote Functions**: Type-safe client-server communication with SvelteKit's experimental remote functions
- **Error Boundaries**: Robust error handling with `<svelte:boundary>` components
- **Effect Library**: Functional error handling and side effect management
- Directus headless CMS integration with auto-generated TypeScript types
- Tailwind CSS for styling
- Cloudflare Workers deployment
- Comprehensive testing with Vitest and Playwright

## Quick Start

```bash
# Install dependencies
bun install  # or npm install

# Set up environment
cp .env.example .env
# Edit .env with your Directus URL

# Start development server
bun run dev  # or npm run dev
```

## Documentation

- **[Development Setup](docs/development/setup.md)** - Getting started guide
- **[Remote Functions Migration](docs/plan/remote-functions-migration.md)** - Migration plan and strategy
- **[Remote Function Examples](docs/plan/remote-function-examples.md)** - Code examples and patterns
- **[Claude AI Guide](docs/development/claude.md)** - AI assistant guidance
- **[Type Generation](docs/development/type-generation.md)** - TypeScript type generation

## Data Architecture

StagePage manages complex hierarchical relationships between festivals, productions, shows, people, and events:

```
Festivals (IMPACT 25)
  ├── Productions (The Seventh Fire - IMPACT 25)
  │   ├── Shows (The Seventh Fire)
  │   ├── Programs (Digital Playbill)
  │   └── Events (Specific Performances)
  └── Programs (Festival-wide program)
```

## Development Commands

```bash
# Development
bun run dev                 # Start development server
bun run build              # Build for production
bun run preview            # Build and preview

# Testing
bun run test               # Run all tests
bun run test:unit          # Run unit tests
bun run test:e2e           # Run end-to-end tests

# Code Quality
bun run lint               # Run linting
bun run format             # Format code
bun run check              # Type check

# Types & Database
bun run types:generate     # Generate types from Directus

# Deployment
bun run deploy             # Deploy to Cloudflare Workers
```

## Remote Functions

This project leverages SvelteKit's experimental remote functions for clean, type-safe data fetching:

```typescript
// data.remote.ts
import { query } from '$app/server';

export const getPrograms = query(async () => {
    // Server-side data fetching
    return await fetchPrograms();
});
```

```svelte
<!-- Component -->
<svelte:boundary>
    {#each await getPrograms() as program}
        <div>{program.title}</div>
    {/each}
    
    {#snippet pending()}
        <p>Loading...</p>
    {/snippet}
    
    {#snippet failed(error, reset)}
        <button onclick={reset}>Try again</button>
    {/snippet}
</svelte:boundary>
```

## Project Status

Currently migrating from traditional SvelteKit load functions to the new remote functions pattern. See the [migration plan](docs/plan/remote-functions-migration.md) for detailed progress and implementation strategy.

## Contributing

See [development setup guide](docs/development/setup.md) for getting started with local development.