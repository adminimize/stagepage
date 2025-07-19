#!/bin/bash

# Script to generate TypeScript types from Directus OpenAPI spec

set -e

echo "🔄 Downloading fresh OpenAPI spec from Directus..."

# Check if DIRECTUS_TOKEN is set and use it for authentication
if [ -n "$DIRECTUS_TOKEN" ]; then
    echo "🔐 Using admin token for authenticated request..."
    curl -s -H "Authorization: Bearer $DIRECTUS_TOKEN" "http://localhost:4343/server/specs/oas" | jq . > directus-openapi-fresh.json
else
    echo "ℹ️  No admin token found, fetching public schema..."
    curl -s "http://localhost:4343/server/specs/oas" | jq . > directus-openapi-fresh.json
fi

echo "🔧 Fixing broken references in OpenAPI spec..."
node scripts/fix-openapi-spec.js

echo "⚡ Generating TypeScript types..."
npx openapi-typescript directus-openapi-fixed.json --immutable -o src/lib/types/directus.ts

echo "✅ TypeScript types generated successfully!"
echo "📝 Types are available in src/lib/types/directus.ts"
echo "🔗 Clean exports available in src/lib/types/index.ts" 