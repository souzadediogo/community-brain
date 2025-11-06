import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"

interface Expert {
  id: string
  name: string
  avatar: string
  title: string
  expertise: string[]
  matchScore: number
}

interface ExpertRecommendationsProps {
  experts: Expert[]
}

export function ExpertRecommendations({ experts }: ExpertRecommendationsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recommended Experts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experts.map((expert) => (
          <div key={expert.id} className="flex items-start gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
              <AvatarFallback>
                {expert.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{expert.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{expert.title}</div>
              <div className="flex flex-wrap gap-1">
                {expert.expertise.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0 bg-transparent">
              <UserPlus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
