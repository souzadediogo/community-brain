"use client"

import { useState } from "react"
import { ThreadCard } from "@/components/thread-card"
import { Sidebar } from "@/components/sidebar"
import { TopContributors } from "@/components/top-contributors"
import { PopularTags } from "@/components/popular-tags"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockThreads } from "@/lib/mock-data"
import { Sparkles, TrendingUp, Clock } from "lucide-react"

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredThreads =
    selectedTags.length > 0
      ? mockThreads.filter((thread) => thread.tags.some((tag) => selectedTags.includes(tag)))
      : mockThreads

  const aiAnsweredThreads = filteredThreads.filter((t) => t.hasAiResponse)
  const recentThreads = [...filteredThreads].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  const trendingThreads = [...filteredThreads].sort((a, b) => b.viewCount - a.viewCount)

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <Sidebar selectedTags={selectedTags} onTagChange={setSelectedTags} />

      {/* Main Content */}
      <div className="flex-1 container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-balance">Executive Community Q&A</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Get expert answers and AI-powered insights for your business questions
            </p>
            {selectedTags.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing threads tagged with: {selectedTags.join(", ")}
              </p>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all" className="gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Answered
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 space-y-4">
              {recentThreads.length > 0 ? (
                recentThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No threads found with selected tags</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="mt-6 space-y-4">
              {trendingThreads.length > 0 ? (
                trendingThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No threads found with selected tags</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai" className="mt-6 space-y-4">
              {aiAnsweredThreads.length > 0 ? (
                aiAnsweredThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No AI-answered threads yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              Load More Threads
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 border-l bg-muted/10 p-6 space-y-6 hidden xl:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <TopContributors />
        <PopularTags />
      </aside>
    </div>
  )
}
