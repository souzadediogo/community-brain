"use client"

import { notFound } from "next/navigation"
import { useState } from "react"
import { mockThreads, mockPosts } from "@/lib/mock-data"
import { PostCard } from "@/components/post-card"
import { AiSummary } from "@/components/ai-summary"
import { ExpertRecommendations } from "@/components/expert-recommendations"
import { ReplyForm } from "@/components/reply-form"
import { SimilarThreads } from "@/components/similar-threads"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Eye, Share2, Bookmark } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ThreadPage({ params }: { params: { id: string } }) {
  const thread = mockThreads.find((t) => t.id === params.id)
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!thread) {
    notFound()
  }

  const posts = mockPosts[params.id] || []

  const mockExperts = [
    {
      id: "e1",
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "VP Engineering at TechCorp",
      expertise: ["SaaS", "Infrastructure", "Scaling"],
      matchScore: 95,
    },
    {
      id: "e2",
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "CTO at StartupHub",
      expertise: ["Cloud", "DevOps", "Architecture"],
      matchScore: 88,
    },
  ]

  const aiSummary =
    "This thread discusses scaling a SaaS product from 100 to 1000 customers. Key recommendations include: implementing auto-scaling infrastructure, hiring DevOps and Customer Success teams, establishing monitoring and incident management processes, and maintaining strong customer communication. Experts emphasize the importance of planning for 3x capacity and keeping key metrics like CAC payback under 12 months."

  return (
    <div className="container py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thread Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold tracking-tight mb-4 text-balance">{thread.title}</h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                    <AvatarFallback>
                      {thread.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{thread.author.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {thread.author.title} • {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread.postCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{thread.viewCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            {/* Original Post */}
            <PostCard
              post={{
                id: "original",
                threadId: thread.id,
                content: thread.content,
                author: thread.author,
                createdAt: thread.createdAt,
                isAiResponse: false,
                upvotes: 0,
                isAcceptedAnswer: false,
              }}
              isOriginalPost
            />

            {/* AI Summary */}
            {thread.hasAiResponse && <AiSummary summary={aiSummary} />}

            {/* Replies */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {posts.length} {posts.length === 1 ? "Reply" : "Replies"}
              </h2>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Reply Form */}
            <ReplyForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ExpertRecommendations experts={mockExperts} />
            <SimilarThreads currentThreadId={thread.id} currentTags={thread.tags} />
          </div>
        </div>
      </div>
    </div>
  )
}
