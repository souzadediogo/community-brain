import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Sparkles, CheckCircle2 } from "lucide-react"
import type { Post } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: Post
  isOriginalPost?: boolean
}

export function PostCard({ post, isOriginalPost = false }: PostCardProps) {
  return (
    <Card className={isOriginalPost ? "border-primary/50" : ""}>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{post.author.name}</span>
                  {post.isAiResponse && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  )}
                  {post.isAcceptedAnswer && (
                    <Badge className="gap-1 bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Accepted Answer
                    </Badge>
                  )}
                  {isOriginalPost && <Badge variant="outline">Original Question</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{post.author.title}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-4">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.upvotes}</span>
              </Button>
              <Button variant="ghost" size="sm">
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
