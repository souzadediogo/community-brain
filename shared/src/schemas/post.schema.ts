/**
 * Zod validation schemas for Post types
 */

import { z } from 'zod'
import { UserSchema } from './user.schema'

export const PostSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid(),
  content: z.string().min(10).max(10000),
  author: UserSchema,
  createdAt: z.coerce.date(),
  isAiResponse: z.boolean(),
  upvotes: z.number().int().min(0),
  isAcceptedAnswer: z.boolean(),
})

export const CreatePostDtoSchema = z.object({
  threadId: z.string().uuid(),
  content: z.string().min(10).max(10000),
})

export const UpdatePostDtoSchema = z.object({
  content: z.string().min(10).max(10000).optional(),
  isAcceptedAnswer: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
})

export const VotePostDtoSchema = z.object({
  postId: z.string().uuid(),
  vote: z.union([z.literal(1), z.literal(-1)]),
})

// Type inference from schemas
export type PostSchemaType = z.infer<typeof PostSchema>
export type CreatePostDtoSchemaType = z.infer<typeof CreatePostDtoSchema>
export type UpdatePostDtoSchemaType = z.infer<typeof UpdatePostDtoSchema>
export type VotePostDtoSchemaType = z.infer<typeof VotePostDtoSchema>
