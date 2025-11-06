import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, Sparkles } from "lucide-react"
import type { Thread } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface ThreadCardProps {
  thread: Thread
}

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/threads/${thread.id}`} className="group">
              <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors text-balance">
                {thread.title}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 text-pretty">{thread.content}</p>
          </div>
          {thread.hasAiResponse && (
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {thread.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${thread.author.id}`} className="flex items-center gap-2 group">
              <Avatar className="h-6 w-6">
                <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                <AvatarFallback>
                  {thread.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {thread.author.name}
                </span>
                <span className="text-xs text-muted-foreground">{thread.author.title}</span>
              </div>
            </Link>
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
            <span className="text-xs">{formatDistanceToNow(thread.updatedAt, { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
