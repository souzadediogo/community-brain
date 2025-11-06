/**
 * Thread-related types for Community Brain
 */

import { User } from './user'

export type ThreadStatus = 'open' | 'answered' | 'closed'

export interface Thread {
  id: string
  title: string
  content: string
  author: User
  tags: string[]
  createdAt: Date
  updatedAt: Date
  postCount: number
  viewCount: number
  hasAiResponse: boolean
  status: ThreadStatus
}

export interface ThreadListItem extends Omit<Thread, 'content'> {
  excerpt?: string
}

export interface CreateThreadDto {
  title: string
  content: string
  tags: string[]
}

export interface UpdateThreadDto {
  title?: string
  content?: string
  tags?: string[]
  status?: ThreadStatus
}
