# Community Service

Node.js/Express service for managing community data (threads, posts, users).

## Responsibilities
- Thread CRUD operations
- Post management
- User profiles and expertise
- Database operations via Prisma
- Type-safe API using OpenAPI-generated types

## Tech Stack
- Node.js 18+
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (runtime validation)
- OpenAPI-generated types (@brain/shared-ts)

## OpenAPI Integration

This service uses TypeScript types generated from the OpenAPI specification to ensure type safety and consistency across the API.

### Generated Types Location
Types are generated in `../../shared/typescript` and imported via the `@brain/shared-ts` package.

### Using Shared Types

#### 1. Import Types
```typescript
import {
  Thread,
  CreateThreadDto,
  UpdateThreadDto,
  ApiResponse,
  ApiError
} from '@brain/shared-ts';
```

Or use the local re-exports:
```typescript
import {
  Thread,
  CreateThreadDto,
  UpdateThreadDto
} from '../types/api.types';
```

#### 2. Type-Safe Request Handlers
```typescript
import { validateBody, createThreadSchema } from '../middleware/validation.middleware';
import { sendSuccess, sendError, createApiError } from '../utils/response.util';

router.post(
  '/threads',
  validateBody(createThreadSchema),
  async (req: Request, res: Response) => {
    const dto = req.body as CreateThreadDto;
    const thread = await threadService.create(dto);
    sendSuccess(res, thread, 201);
  }
);
```

#### 3. Validation Middleware
Request validation is handled by Zod schemas that match the OpenAPI spec:
- `createThreadSchema` - Validates thread creation requests
- `updateThreadSchema` - Validates thread update requests
- `createPostSchema` - Validates post creation requests
- `votePostSchema` - Validates vote requests

#### 4. Response Utilities
Use the response utilities for consistent API responses:
```typescript
// Success response
sendSuccess(res, data, statusCode, pagination);

// Error response
sendError(res, createApiError('ERROR_CODE', 'Error message'), statusCode);
```

### Development Workflow

#### 1. Update OpenAPI Spec
When the API changes, update the OpenAPI specification in `../../shared/openapi.yaml`

#### 2. Regenerate Types
```bash
cd ../../shared/typescript
npm run generate
npm run build
```

#### 3. Update Service
The types are automatically available in the community service after rebuilding the shared package.

#### 4. Rebuild Community Service
```bash
npm install  # Updates the @brain/shared-ts package
npm run build
```

### Type Mapping Notes

**Status Values**: The OpenAPI spec uses lowercase status values (`"open" | "answered" | "closed"`), but the Prisma schema uses UPPERCASE (`OPEN | ANSWERED | CLOSED`). The validation middleware accepts UPPERCASE values to match the database schema.

**Field Naming**: Some fields are renamed when mapping between API DTOs and database models:
- API `content` maps to database `body` for threads
- Dates are ISO strings in the API but Date objects in the database

### File Structure
```
src/
├── types/
│   └── api.types.ts          # Re-exports of shared types
├── middleware/
│   └── validation.middleware.ts  # Zod schemas for validation
├── utils/
│   └── response.util.ts       # Consistent response formatting
└── routes/
    ├── threads.ts             # Thread endpoints using shared types
    └── posts.ts               # Post endpoints using shared types
```

### Example: Creating a New Endpoint

```typescript
import { CreatePostDto } from '../types/api.types';
import { validateBody, createPostSchema } from '../middleware/validation.middleware';
import { sendSuccess, sendError, createApiError } from '../utils/response.util';

router.post(
  '/posts',
  validateBody(createPostSchema),
  async (req: Request, res: Response) => {
    try {
      const dto = req.body as CreatePostDto;
      const post = await postService.create(dto);
      sendSuccess(res, post, 201);
    } catch (error) {
      sendError(
        res,
        createApiError('CREATE_ERROR', 'Failed to create post'),
        500
      );
    }
  }
);
```
