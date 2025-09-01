# Documentation Cleanup Plan

## Overview

Organize project documentation into a clean, structured format within the `docs/` directory and remove redundant files from the project root.

## Current Documentation State

### Files to Move to docs/
- `agents.md` → `docs/development/agents.md`
- `CLAUDE.md` → `docs/development/claude.md`
- `TYPE_GENERATION.md` → `docs/development/type-generation.md`
- `README.md` → Keep in root, but update content

### Files to Remove/Consolidate
- `directus-openapi*.json` files → Move to `docs/api/` or remove if generated
- Redundant package files (`package-lock.json` if using `bun.lock`)

### New Documentation Structure
```
docs/
├── development/           # Developer guides and tools
│   ├── agents.md         # AI agent guidance (moved from root)
│   ├── claude.md         # Claude-specific guidance (moved from root)
│   ├── type-generation.md # Type generation guide (moved from root)
│   └── setup.md          # Development setup guide (new)
├── plan/                 # Project planning documents
│   ├── remote-functions-migration.md
│   ├── remote-function-examples.md
│   └── documentation-cleanup.md (this file)
├── sveltekit/           # SvelteKit-specific documentation
│   ├── RemoteFunctions.md
│   └── SveltekitBoundaries.md
├── api/                 # API documentation (new)
│   └── directus-schema.md # Directus schema documentation (new)
└── internal/            # Internal documentation (existing)
```

## Actions Required

### 1. Move Files
- [x] `agents.md` → `docs/development/agents.md`
- [x] `CLAUDE.md` → `docs/development/claude.md`
- [x] `TYPE_GENERATION.md` → `docs/development/type-generation.md`

### 2. Update References
Update any references to moved files in:
- IDE configurations
- Scripts
- Other documentation files

### 3. Create New Documentation
- Development setup guide
- API documentation structure
- Contributing guidelines

### 4. Clean Root Directory
Remove or move non-essential files from project root:
- OpenAPI specification files (move to docs/api/ or remove if generated)
- Redundant lock files

### 5. Update README.md
Refresh the root README with:
- Current project status
- Quick start guide
- Links to detailed documentation in docs/

## Implementation Priority

1. **High**: Move core documentation files
2. **Medium**: Update references and create new structure
3. **Low**: Clean up generated/redundant files

This cleanup will provide a cleaner project root and better organized documentation for both developers and AI agents working on the project.
