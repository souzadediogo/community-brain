/**
 * Zod validation schemas for User types
 */

import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  avatar: z.string().url(),
  title: z.string().min(1).max(200),
  expertise: z.array(z.string()).min(1).max(10),
})

export const UserStatsSchema = z.object({
  questionsAsked: z.number().int().min(0),
  answersGiven: z.number().int().min(0),
  acceptedAnswers: z.number().int().min(0),
  totalUpvotes: z.number().int().min(0),
})

export const UserProfileSchema = UserSchema.extend({
  company: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  bio: z.string().max(1000),
  joinedDate: z.coerce.date(),
  stats: UserStatsSchema,
})

// Type inference from schemas
export type UserSchemaType = z.infer<typeof UserSchema>
export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>
export type UserStatsSchemaType = z.infer<typeof UserStatsSchema>
