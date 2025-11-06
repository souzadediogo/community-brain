/**
 * User-related types for Community Brain
 */

export interface User {
  id: string
  name: string
  avatar: string
  title: string
  expertise: string[]
}

export interface UserProfile extends User {
  company: string
  location: string
  bio: string
  joinedDate: Date
  stats: UserStats
}

export interface UserStats {
  questionsAsked: number
  answersGiven: number
  acceptedAnswers: number
  totalUpvotes: number
}
