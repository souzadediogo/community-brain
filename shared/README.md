# @brain/shared

Shared TypeScript types and Zod validation schemas for Community Brain services.

## Overview

This package provides a single source of truth for data types used across all Community Brain services (frontend, api-gateway, community, assistant, evaluation).

## Installation

This package is linked locally in the monorepo:

```json
{
  "dependencies": {
    "@brain/shared": "file:../shared"
  }
}
```

## Usage

### Importing Types

```typescript
import { Thread, Post, UserProfile, ApiResponse } from '@brain/shared'

const thread: Thread = {
  id: '123',
  title: 'My Question',
  // ...
}
```

### Importing Validation Schemas

```typescript
import { ThreadSchema, CreateThreadDtoSchema } from '@brain/shared'

// Validate data
const result = ThreadSchema.safeParse(data)

if (result.success) {
  const thread = result.data
  // thread is type-safe
}

// Validate request body
app.post('/threads', (req, res) => {
  const validation = CreateThreadDtoSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({
      error: validation.error
    })
  }

  const dto = validation.data
  // dto is validated and type-safe
})
```

## Available Types

### User Types
- `User` - Basic user information
- `UserProfile` - Extended user profile with stats
- `UserStats` - User activity statistics

### Thread Types
- `Thread` - Full thread data
- `ThreadListItem` - Thread without full content (for lists)
- `ThreadStatus` - Thread status enum
- `CreateThreadDto` - DTO for creating threads
- `UpdateThreadDto` - DTO for updating threads

### Post Types
- `Post` - Post/reply data
- `CreatePostDto` - DTO for creating posts
- `UpdatePostDto` - DTO for updating posts
- `VotePostDto` - DTO for voting on posts

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated API response
- `ApiError` - Error response structure
- `ApiMeta` - Response metadata
- `PaginationMeta` - Pagination information
- `ListQueryParams` - Query params for list endpoints
- `SearchQueryParams` - Query params for search endpoints

## Available Schemas

All types have corresponding Zod schemas for runtime validation:

- `UserSchema`, `UserProfileSchema`, `UserStatsSchema`
- `ThreadSchema`, `ThreadListItemSchema`, `ThreadStatusSchema`
- `CreateThreadDtoSchema`, `UpdateThreadDtoSchema`
- `PostSchema`, `CreatePostDtoSchema`, `UpdatePostDtoSchema`, `VotePostDtoSchema`
- `ApiResponseSchema()`, `PaginatedResponseSchema()`
- `ApiErrorSchema`, `ApiMetaSchema`, `PaginationMetaSchema`
- `ListQueryParamsSchema`, `SearchQueryParamsSchema`

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode
npm run dev

# Clean build artifacts
npm run clean
```

## Structure

```
shared/
├── src/
│   ├── types/           # TypeScript interfaces
│   │   ├── user.ts
│   │   ├── thread.ts
│   │   ├── post.ts
│   │   └── api.ts
│   ├── schemas/         # Zod validation schemas
│   │   ├── user.schema.ts
│   │   ├── thread.schema.ts
│   │   ├── post.schema.ts
│   │   └── api.schema.ts
│   └── index.ts         # Main exports
└── dist/                # Compiled output
```

## Benefits

✅ **Single Source of Truth** - All services use identical types
✅ **Type Safety** - Compile-time type checking across services
✅ **Runtime Validation** - Zod schemas for request/response validation
✅ **API Contracts** - Explicit DTOs for all operations
✅ **Auto-completion** - Full IDE support across the codebase

## Version

Current version: 0.1.0
