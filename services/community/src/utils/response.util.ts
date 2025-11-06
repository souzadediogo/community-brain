/**
 * Response utility functions for consistent API responses
 * Follows the OpenAPI ApiResponse schema
 */

import { Response } from 'express';
import { ApiResponse, ApiError, ApiMeta, PaginationMeta } from '../types/api.types';

/**
 * Send a successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  pagination?: PaginationMeta
): void {
  const meta: ApiMeta = {
    timestamp: new Date().toISOString(),
  };

  if (pagination) {
    meta.pagination = pagination;
  }

  const response = {
    success: true,
    data,
    meta,
  };

  res.status(statusCode).json(response);
}

/**
 * Send an error response
 */
export function sendError(
  res: Response,
  error: ApiError,
  statusCode: number = 500
): void {
  const response: ApiResponse = {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(statusCode).json(response);
}

/**
 * Create an ApiError object
 */
export function createApiError(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiError {
  return {
    code,
    message,
    details,
  };
}

/**
 * Calculate pagination metadata
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
