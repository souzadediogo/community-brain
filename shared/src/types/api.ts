/**
 * API response types for Community Brain
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ApiMeta {
  timestamp: string
  requestId?: string
  pagination?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta & {
    pagination: PaginationMeta
  }
}

// Query parameters for list endpoints
export interface ListQueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface SearchQueryParams extends ListQueryParams {
  q: string // search query
  filters?: Record<string, any>
}
