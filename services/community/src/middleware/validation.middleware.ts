/**
 * Validation middleware for request bodies
 * Uses Zod for runtime validation with TypeScript types from OpenAPI
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ApiError } from '../types/api.types';

/**
 * Generic validation middleware factory
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const apiError: ApiError = {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: {
            errors: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
        };
        res.status(400).json({
          success: false,
          error: apiError,
          meta: {
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        next(error);
      }
    }
  };
}

/**
 * Validation schemas for DTOs
 * These are based on the OpenAPI schema but provide runtime validation
 */

// Thread validation schemas
export const createThreadSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

export const updateThreadSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['OPEN', 'ANSWERED', 'CLOSED']).optional(),
});

// Post validation schemas
export const createPostSchema = z.object({
  threadId: z.string().uuid(),
  content: z.string().min(1),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).optional(),
  isAcceptedAnswer: z.boolean().optional(),
});

export const votePostSchema = z.object({
  postId: z.string().uuid(),
  vote: z.union([z.literal(1), z.literal(-1)]),
});
