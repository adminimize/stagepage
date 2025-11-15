# StagePage Agent Guidelines

## Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Build and preview with Wrangler

# Testing
npm run test               # Run all tests (unit + e2e)
npm run test:unit          # Run unit tests with Vitest
npm run test:e2e           # Run e2e tests with Playwright
npm run test:unit -- path/to/test.ts  # Run single test file

# Code Quality
npm run lint               # Prettier check + ESLint
npm run format             # Format code with Prettier
npm run check              # Type check with svelte-check

# Database & Types
npm run types:generate     # Generate types from Directus
```

## Code Style

- **Effect Library**: Use Effect for all server-side code (no try/catch, no console.log)
- **Imports**: Use relative imports for $lib, absolute for external packages
- **Types**: Strict TypeScript, no implicit any, use generated Directus types
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Domain-specific error types extending Data.TaggedError
- **Components**: Svelte 5 runes, TailwindCSS 4 for styling
- **Server Code**: Use Effect.Context for dependency injection, pipe for composition

## Environment Variables

You currently have 86 environment variables set. Required: DATABASE_URL for PostgreSQL connection.
