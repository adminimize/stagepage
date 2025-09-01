# Implementation Roadmap

## Overview

This roadmap outlines the step-by-step implementation of remote functions across the StagePage codebase, replacing traditional SvelteKit load functions with the new remote functions pattern.

## Phase 1: Foundation ✅

**Status**: Complete
- [x] Enable remote functions in `svelte.config.js`
- [x] Enable async compiler option
- [x] Create initial example (`programs/data.remote.ts`)
- [x] Organize documentation structure
- [x] Create migration plan and examples

## Phase 2: Simple List Views (Week 1)

**Priority**: High - These are straightforward migrations with minimal complexity

### 2.1 Basic Collections
- [ ] `src/routes/festivals/+page.server.ts` → `data.remote.ts`
- [ ] `src/routes/people/+page.server.ts` → `data.remote.ts`
- [ ] `src/routes/shows/+page.server.ts` → `data.remote.ts`
- [ ] `src/routes/organizations/+page.server.ts` → `data.remote.ts`
- [ ] `src/routes/events/+page.server.ts` → `data.remote.ts`
- [ ] `src/routes/songs/+page.server.ts` → `data.remote.ts`

### 2.2 Update Components
For each migrated route:
- [ ] Update component to use remote function import
- [ ] Add `<svelte:boundary>` with pending/failed snippets
- [ ] Remove `let { data } = $props();` dependency
- [ ] Test loading and error states

## Phase 3: Complex Queries (Week 2)

**Priority**: Medium - These require more careful migration due to Effect usage and complex queries

### 3.1 Productions Route
- [ ] Migrate `src/routes/productions/+page.server.ts`
- [ ] Preserve Effect library patterns
- [ ] Handle complex field relationships
- [ ] Test with multiple filters

### 3.2 Venues and Years
- [ ] `src/routes/venues/+page.server.ts` → `data.remote.ts`
- [ ] `src/routes/years/+page.server.ts` → `data.remote.ts`
- [ ] Handle aggregation queries
- [ ] Preserve statistical calculations

## Phase 4: Detail Views (Week 2-3)

**Priority**: High - Critical for user experience

### 4.1 Program Detail (Complex)
- [ ] `src/routes/programs/[id]/+page.server.ts` → `data.remote.ts`
- [ ] Handle multi-step section loading
- [ ] Implement proper error handling for missing sections
- [ ] Add validation schema for ID parameter

### 4.2 Production Detail (Effect Pattern)
- [ ] `src/routes/productions/[id]/+page.server.ts` → `data.remote.ts`
- [ ] Preserve complex Effect usage
- [ ] Handle deep nested relationships
- [ ] Maintain performance with selective fields

### 4.3 Other Detail Views
- [ ] `src/routes/festivals/[id]/+page.server.ts`
- [ ] `src/routes/people/[id]/+page.server.ts`
- [ ] `src/routes/shows/[id]/+page.server.ts`
- [ ] `src/routes/organizations/[id]/+page.server.ts`
- [ ] `src/routes/venues/[id]/+page.server.ts`
- [ ] `src/routes/events/[id]/+page.server.ts`
- [ ] `src/routes/songs/[id]/+page.server.ts`

## Phase 5: Specialized Views (Week 3-4)

**Priority**: Low - These are specialized routes with unique logic

### 5.1 Location-Based Routes
- [ ] `src/routes/cities/[city]/productions/+page.server.ts`
- [ ] `src/routes/venues/[venue]/productions/+page.server.ts`
- [ ] Handle location-based filtering
- [ ] Implement proper parameter validation

### 5.2 Time-Based Routes
- [ ] `src/routes/years/[year]/+page.server.ts`
- [ ] Handle year-based filtering and aggregation
- [ ] Maintain statistical calculations

### 5.3 Root and Utility Routes
- [ ] `src/routes/+page.server.ts` (home page)
- [ ] `src/routes/cities/+page.server.ts`
- [ ] Review `src/routes/example/+page.server.ts` (remove if not needed)

## Phase 6: Error Handling & Polish (Week 4)

### 6.1 Standardized Error Components
- [ ] Create reusable error boundary components
- [ ] Implement consistent loading states
- [ ] Add retry mechanisms
- [ ] Create error reporting utilities

### 6.2 Performance Optimization
- [ ] Implement query caching where appropriate
- [ ] Add prerender functions for static data
- [ ] Optimize field selections
- [ ] Monitor bundle size impact

### 6.3 Testing & Documentation
- [ ] Test all migrated routes
- [ ] Update component documentation
- [ ] Create troubleshooting guide
- [ ] Performance benchmarking

## Implementation Guidelines

### For Each Route Migration:

1. **Analyze Current Logic**
   - Identify query patterns
   - Note any Effect usage
   - Document complex relationships

2. **Create Remote Function**
   - Add proper validation schemas
   - Preserve Effect patterns where used
   - Handle errors appropriately

3. **Update Component**
   - Add remote function import
   - Wrap with `<svelte:boundary>`
   - Add loading and error states
   - Remove old data prop dependency

4. **Test Thoroughly**
   - Test normal operation
   - Test loading states
   - Test error scenarios
   - Test parameter validation (for detail routes)

5. **Clean Up**
   - Remove old `+page.server.ts` file
   - Update any documentation references
   - Verify no broken imports

### Code Standards

- Use `valibot` for parameter validation
- Maintain Effect library usage where already implemented
- Consistent error boundary patterns
- Proper TypeScript typing throughout
- Follow existing field selection patterns from Directus queries

## Success Criteria

- [ ] All 25 `+page.server.ts` files migrated
- [ ] No broken routes or missing functionality
- [ ] Consistent error handling across all routes
- [ ] Improved loading states and user experience
- [ ] Full TypeScript compatibility maintained
- [ ] Performance maintained or improved
- [ ] Documentation updated and accurate

## Risk Mitigation

- **Complex Queries**: Start with simple routes to establish patterns
- **Effect Integration**: Preserve existing Effect patterns carefully
- **Parameter Validation**: Test edge cases thoroughly
- **Performance**: Monitor bundle size and loading times
- **User Experience**: Ensure no regression in functionality

This roadmap provides a systematic approach to migrating the entire codebase while maintaining stability and improving the developer and user experience.
