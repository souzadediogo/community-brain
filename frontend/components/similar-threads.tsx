import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TrendingUp } from "lucide-react"

interface SimilarThread {
  id: string
  title: string
  postCount: number
  viewCount: number
  tags: string[]
  hasAiResponse?: boolean
}

interface SimilarThreadsProps {
  currentThreadId: string
  currentTags: string[]
}

export function SimilarThreads({ currentThreadId, currentTags }: SimilarThreadsProps) {
  // Mock similar threads based on tags
  const similarThreads: SimilarThread[] = [
    {
      id: "2",
      title: "What metrics should I track when scaling from 10 to 100 customers?",
      postCount: 8,
      viewCount: 234,
      tags: ["SaaS", "Metrics"],
      hasAiResponse: true,
    },
    {
      id: "3",
      title: "Infrastructure recommendations for rapid growth",
      postCount: 12,
      viewCount: 456,
      tags: ["Infrastructure", "Scaling"],
      hasAiResponse: true,
    },
    {
      id: "5",
      title: "Building a customer success team: when and how?",
      postCount: 15,
      viewCount: 389,
      tags: ["SaaS", "Team Building"],
      hasAiResponse: false,
    },
    {
      id: "7",
      title: "Cost optimization strategies for cloud infrastructure",
      postCount: 9,
      viewCount: 278,
      tags: ["Infrastructure", "Cloud"],
      hasAiResponse: true,
    },
  ].filter((thread) => thread.id !== currentThreadId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Similar Threads
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {similarThreads.map((thread) => (
          <Link key={thread.id} href={`/threads/${thread.id}`} className="block group">
            <div className="space-y-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {thread.title}
              </h4>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{thread.postCount}</span>
                </div>
                <span>•</span>
                <span>{thread.viewCount} views</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {thread.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {thread.hasAiResponse && (
                  <Badge variant="default" className="text-xs">
                    AI
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
