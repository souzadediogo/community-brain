/**
 * Zod validation schemas for API types
 */

import { z } from 'zod'

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
})

export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})

export const ApiMetaSchema = z.object({
  timestamp: z.string().datetime(),
  requestId: z.string().optional(),
  pagination: PaginationMetaSchema.optional(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    meta: ApiMetaSchema.optional(),
  })

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    meta: ApiMetaSchema.extend({
      pagination: PaginationMetaSchema,
    }),
  })

export const ListQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const SearchQueryParamsSchema = ListQueryParamsSchema.extend({
  q: z.string().min(1),
  filters: z.record(z.any()).optional(),
})

// Type inference from schemas
export type ApiErrorSchemaType = z.infer<typeof ApiErrorSchema>
export type PaginationMetaSchemaType = z.infer<typeof PaginationMetaSchema>
export type ApiMetaSchemaType = z.infer<typeof ApiMetaSchema>
export type ListQueryParamsSchemaType = z.infer<typeof ListQueryParamsSchema>
export type SearchQueryParamsSchemaType = z.infer<typeof SearchQueryParamsSchema>
