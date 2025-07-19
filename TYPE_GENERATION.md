# TypeScript Type Generation for Directus

This project uses `openapi-typescript` to generate TypeScript types from the Directus OpenAPI specification.

## Quick Start

Generate types from your running Directus instance:

```bash
npm run types:generate
```

This will:
1. Download the OpenAPI spec from `http://localhost:4343/server/specs/oas`
2. Fix any broken references in the spec
3. Generate TypeScript types to `src/lib/types/directus.ts`

## Using the Generated Types

### Import Types

```typescript
import type { DirectusFile, Page, Post } from '$lib/types';
import { getPages, getPage } from '$lib/directus';
```

### Example Usage

```typescript
// Get all pages with type safety
const pages: Page[] = await getPages({
  fields: ['*'],
  filter: { status: { _eq: 'published' } }
});

// Get a specific page
const page: Page = await getPage('page-id', {
  fields: ['*', 'blocks.*']
});

// Get files
const files: DirectusFile[] = await getFiles({
  fields: ['*'],
  filter: { folder: { _eq: 'some-folder-id' } }
});
```

### Available Types

The generated types include:

- **Content Collections**: `Page`, `Post`, `Form`, `Navigation`, etc.
- **Block Types**: `BlockHero`, `BlockButton`, `BlockGallery`, etc.
- **Core Types**: `DirectusFile`, `DirectusUser`
- **API Types**: `DirectusResponse<T>`, `DirectusListResponse<T>`

## Files Structure

- `src/lib/types/directus.ts` - Raw generated types from OpenAPI
- `src/lib/types/index.ts` - Clean exports and utility types
- `src/lib/directus.ts` - Typed Directus client and helper functions

## Scripts

- `scripts/fix-openapi-spec.js` - Fixes broken references in Directus OpenAPI spec
- `scripts/generate-types.sh` - Complete workflow to generate types
- `directus-openapi-fixed.json` - Fixed OpenAPI specification

## Troubleshooting

### Broken References

If you encounter `Can't resolve $ref` errors, it's likely due to broken references in the Directus OpenAPI spec. The `fix-openapi-spec.js` script handles known issues like the missing `Folders` schema reference.

### Type Mismatches

If types don't match your actual data, regenerate them:

```bash
npm run types:generate
```

### Authentication Required

If the OpenAPI endpoint requires authentication, you may need to modify the curl command in `generate-types.sh` to include authentication headers.

## Manual Type Generation

If you need to customize the process:

```bash
# Download spec
curl -s "http://localhost:4343/server/specs/oas" | jq . > directus-openapi-fresh.json

# Fix broken references
node scripts/fix-openapi-spec.js

# Generate types
npx openapi-typescript directus-openapi-fixed.json --immutable -o src/lib/types/directus.ts
``` 