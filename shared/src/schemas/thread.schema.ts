/**
 * Zod validation schemas for Thread types
 */

import { z } from 'zod'
import { UserSchema } from './user.schema'

export const ThreadStatusSchema = z.enum(['open', 'answered', 'closed'])

export const ThreadSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(10).max(300),
  content: z.string().min(20).max(10000),
  author: UserSchema,
  tags: z.array(z.string()).min(1).max(5),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  postCount: z.number().int().min(0),
  viewCount: z.number().int().min(0),
  hasAiResponse: z.boolean(),
  status: ThreadStatusSchema,
})

export const ThreadListItemSchema = ThreadSchema.omit({ content: true }).extend({
  excerpt: z.string().max(200).optional(),
})

export const CreateThreadDtoSchema = z.object({
  title: z.string().min(10).max(300),
  content: z.string().min(20).max(10000),
  tags: z.array(z.string()).min(1).max(5),
})

export const UpdateThreadDtoSchema = z.object({
  title: z.string().min(10).max(300).optional(),
  content: z.string().min(20).max(10000).optional(),
  tags: z.array(z.string()).min(1).max(5).optional(),
  status: ThreadStatusSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
})

// Type inference from schemas
export type ThreadSchemaType = z.infer<typeof ThreadSchema>
export type ThreadListItemSchemaType = z.infer<typeof ThreadListItemSchema>
export type CreateThreadDtoSchemaType = z.infer<typeof CreateThreadDtoSchema>
export type UpdateThreadDtoSchemaType = z.infer<typeof UpdateThreadDtoSchema>
