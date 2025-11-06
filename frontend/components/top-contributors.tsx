import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface Contributor {
  id: string
  name: string
  avatarUrl?: string
  title: string
  postCount: number
  upvotes: number
}

const topContributors: Contributor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatarUrl: "/professional-woman-diverse.png",
    title: "VP of Product",
    postCount: 47,
    upvotes: 234,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    avatarUrl: "/professional-man.jpg",
    title: "CTO",
    postCount: 38,
    upvotes: 198,
  },
  {
    id: "3",
    name: "Emily Watson",
    avatarUrl: "/professional-woman-executive.png",
    title: "Head of Marketing",
    postCount: 35,
    upvotes: 176,
  },
  {
    id: "4",
    name: "David Kim",
    avatarUrl: "/professional-asian-man.png",
    title: "CFO",
    postCount: 29,
    upvotes: 145,
  },
]

export function TopContributors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topContributors.map((contributor, index) => (
          <Link key={contributor.id} href={`/profile/${contributor.id}`} className="flex items-start gap-3 group">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={contributor.avatarUrl || "/placeholder.svg"} alt={contributor.name} />
                <AvatarFallback>
                  {contributor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {index + 1}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                {contributor.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{contributor.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">{contributor.postCount} posts</span>
                <span className="text-xs text-muted-foreground">{contributor.upvotes} upvotes</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
