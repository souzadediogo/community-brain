/**
 * API Types - Re-exports from shared types for easy importing
 */

export {
  // Core types
  User,
  UserProfile,
  UserStats,
  Thread,
  ThreadListItem,
  ThreadStatus,
  Post,

  // DTOs
  CreateThreadDto,
  UpdateThreadDto,
  CreatePostDto,
  UpdatePostDto,
  VotePostDto,

  // API Response types
  ApiError,
  ApiResponse,
  ApiMeta,
  PaginationMeta,

  // Operation types
  CreateThreadRequest,
  CreateThreadResponse,
  GetThreadResponse,
  CreatePostRequest,
  CreatePostResponse,
} from '@brain/shared-ts';
