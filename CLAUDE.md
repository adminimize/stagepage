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

# Code Quality
npm run lint               # Run Prettier check and ESLint
npm run format             # Format code with Prettier
npm run check              # Type check with svelte-check
npm run check:watch        # Type check in watch mode

# Database
npm run db:push            # Push schema changes to database
npm run db:migrate         # Run database migrations
npm run types:generate     # Generate TypeScript types from Directus

# Deployment
npm run deploy             # Build and deploy to Cloudflare Workers
npm run cf-typegen         # Generate Cloudflare Worker types
```

## Project Overview

StagePage is a digital playbill system for theater festivals and productions. It manages complex hierarchical relationships between festivals, productions, shows, people, and events to create comprehensive digital programs.

## Tech Stack

- **Frontend**: SvelteKit 2 with Svelte 5, TailwindCSS 4
- **Backend**: Cloudflare Workers with SvelteKit adapter
- **CMS**: Directus headless CMS with TypeScript type generation
- **Testing**: Vitest (unit), Playwright (e2e)

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

### Key Collections (Future Directus Integration)
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

## Development Notes

- Current auth system is placeholder Lucia example code - ignore for now
- The project will integrate with Directus CMS for content management
- Focus on frontend components that can handle complex nested theater data
- Programs can be production-specific, festival-wide, or event-specific
- Use the "magic query pattern" to fetch complete program data in single API calls
- Credit aggregation merges data from multiple levels (show → production → program)

## Environment Setup

Requires `DATABASE_URL` environment variable for PostgreSQL connection (current basic setup).
```

## Project Approach

- We are going to keep doing this - continuously iterating and improving the project with a focus on creating a flexible, comprehensive digital playbill system

## Current Status

- We are currently at a point of establishing the core architecture and data models for StagePage
- Laying groundwork for a flexible system that can handle complex theater production relationships
- Focusing on building modular, reusable components that can adapt to various theater festival and production scenarios