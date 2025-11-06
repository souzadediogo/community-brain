/**
 * Post-related types for Community Brain
 */

import { User } from './user'

export interface Post {
  id: string
  threadId: string
  content: string
  author: User
  createdAt: Date
  isAiResponse: boolean
  upvotes: number
  isAcceptedAnswer: boolean
}

export interface CreatePostDto {
  threadId: string
  content: string
}

export interface UpdatePostDto {
  content?: string
  isAcceptedAnswer?: boolean
}

export interface VotePostDto {
  postId: string
  vote: 1 | -1 // upvote or downvote
}
