import { notFound } from "next/navigation"
import { mockUserProfiles, mockThreads } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThreadCard } from "@/components/thread-card"
import { MapPin, Calendar, MessageSquare, CheckCircle2, ThumbsUp, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = mockUserProfiles[id]

  if (!profile) {
    notFound()
  }

  // Get user's threads
  const userThreads = mockThreads.filter((t) => t.author.id === id)

  return (
    <div className="container py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 flex-shrink-0">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">{profile.name}</h1>
                    <p className="text-lg text-muted-foreground mb-3">
                      {profile.title} at {profile.company}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {formatDistanceToNow(profile.joinedDate, { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  <Button className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">{profile.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-2xl font-bold">{profile.stats.questionsAsked}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-2xl font-bold">{profile.stats.answersGiven}</div>
                <div className="text-sm text-muted-foreground">Answers</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{profile.stats.acceptedAnswers}</div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <ThumbsUp className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-2xl font-bold">{profile.stats.totalUpvotes}</div>
                <div className="text-sm text-muted-foreground">Upvotes</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="questions">Questions ({profile.stats.questionsAsked})</TabsTrigger>
            <TabsTrigger value="answers">Answers ({profile.stats.answersGiven})</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            {userThreads.length > 0 ? (
              userThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No questions asked yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="answers" className="space-y-4">
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Answer history coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
