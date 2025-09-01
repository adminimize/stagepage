# Development Setup

## Prerequisites

- Node.js 18+ or Bun
- Access to Directus CMS instance
- Environment variables configured

## Installation

```bash
# Clone and install dependencies
git clone <repository>
cd stagepage
bun install  # or npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Directus URL and other configuration
```

## Environment Variables

```bash
# .env
PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
DATABASE_URL=postgresql://... # If using database features
```

## Development Commands

```bash
# Development
bun run dev                 # Start development server
bun run build              # Build for production
bun run preview            # Build and preview with Wrangler

# Testing
bun run test               # Run all tests (unit + e2e)
bun run test:unit          # Run unit tests with Vitest
bun run test:e2e           # Run end-to-end tests with Playwright

# Code Quality
bun run lint               # Run Prettier check and ESLint
bun run format             # Format code with Prettier
bun run check              # Type check with svelte-check
bun run check:watch        # Type check in watch mode

# Database & Types
bun run types:generate     # Generate TypeScript types from Directus

# Deployment
bun run deploy             # Build and deploy to Cloudflare Workers
bun run cf-typegen         # Generate Cloudflare Worker types
```

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable Svelte components
│   ├── directus.ts       # Directus client configuration
│   ├── server/           # Server-side utilities
│   └── types/            # TypeScript type definitions
├── routes/               # SvelteKit routes
│   ├── [collection]/
│   │   ├── data.remote.ts    # Remote functions for data fetching
│   │   ├── +page.svelte      # Page component
│   │   └── [id]/
│   │       ├── data.remote.ts
│   │       └── +page.svelte
└── app.html              # HTML template
```

## Remote Functions

This project uses SvelteKit's experimental remote functions feature for type-safe server communication:

```typescript
// Example remote function
import { query } from '$app/server';
import { createDirectusClient } from '$lib/directus';

export const getPrograms = query(async () => {
    const directus = await createDirectusClient();
    return await directus.request(/* ... */);
});
```

See `docs/plan/remote-function-examples.md` for comprehensive examples.

## Effect Library Usage

Server-side code uses the Effect library for functional error handling:

```typescript
import { Effect, pipe } from 'effect';

const getData = pipe(
    Effect.tryPromise(() => fetchData()),
    Effect.catchAll(error => Effect.succeed(fallbackData))
);
```

## Development Guidelines

1. **Remote Functions**: Use remote functions instead of traditional load functions
2. **Error Boundaries**: Wrap components with `<svelte:boundary>` for error handling
3. **Effect Library**: Use Effect for server-side error handling, not try/catch
4. **Type Safety**: Generate types from Directus schema regularly
5. **Svelte 5**: Use new syntax (e.g., `onsubmit` instead of `on:submit`)

## Troubleshooting

### Type Generation Issues
```bash
# Regenerate types if schema changes
bun run types:generate
```

### Remote Function Errors
- Ensure `remoteFunctions: true` is enabled in `svelte.config.js`
- Check that remote functions are in `.remote.ts` files
- Verify validation schemas for parameterized queries

### Development Server Issues
- Clear `.svelte-kit` directory: `rm -rf .svelte-kit`
- Restart development server
- Check environment variables are set correctly
