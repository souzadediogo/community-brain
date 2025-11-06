"use client"

import { useState } from "react"
import { ThreadCard } from "@/components/thread-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Trash2 } from "lucide-react"

export default function BookmarksPage() {
  const [bookmarkedThreads] = useState([
    {
      id: "1",
      title: "How do I scale my SaaS product from 100 to 1000 customers?",
      content:
        "We've successfully grown to 100 customers, but I'm concerned about our infrastructure and team's ability to handle 10x growth. What are the key considerations?",
      author: {
        id: "1",
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "CEO at TechStart",
        expertise: ["SaaS", "Scaling", "Infrastructure"],
      },
      tags: ["SaaS", "Scaling", "Infrastructure"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      postCount: 12,
      viewCount: 456,
      upvotes: 24,
      hasAiResponse: true,
      hasAcceptedAnswer: true,
      status: "answered" as const,
      bookmarkedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      id: "3",
      title: "Best practices for implementing zero-trust security in enterprise",
      content:
        "Looking for practical advice on implementing zero-trust security architecture in a large enterprise environment with legacy systems.",
      author: {
        id: "3",
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "CISO at SecureCorp",
        expertise: ["Security", "Enterprise", "Architecture"],
      },
      tags: ["Security", "Enterprise", "Architecture"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      postCount: 8,
      viewCount: 234,
      upvotes: 15,
      hasAiResponse: true,
      hasAcceptedAnswer: false,
      status: "open" as const,
      bookmarkedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: "5",
      title: "Strategies for reducing cloud infrastructure costs by 30%",
      content:
        "Our cloud costs have been growing faster than revenue. What are proven strategies to optimize without sacrificing performance?",
      author: {
        id: "5",
        name: "Rachel Green",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "VP Engineering at CloudTech",
        expertise: ["Cloud", "Cost Optimization", "Infrastructure"],
      },
      tags: ["Cloud", "Cost Optimization", "Infrastructure"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      postCount: 15,
      viewCount: 567,
      upvotes: 32,
      hasAiResponse: true,
      hasAcceptedAnswer: true,
      status: "answered" as const,
      bookmarkedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  ])

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          </div>
          <p className="text-muted-foreground">Threads you've saved for later reference</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Bookmarks ({bookmarkedThreads.length})</TabsTrigger>
            <TabsTrigger value="answered">
              With Answers ({bookmarkedThreads.filter((t) => t.hasAcceptedAnswer).length})
            </TabsTrigger>
            <TabsTrigger value="ai">
              AI Answered ({bookmarkedThreads.filter((t) => t.hasAiResponse).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bookmarkedThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
                <Bookmark className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-semibold mb-1">No bookmarks yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Save threads you want to reference later by clicking the bookmark button
                </p>
              </div>
            ) : (
              bookmarkedThreads.map((thread) => (
                <div key={thread.id} className="relative group">
                  <ThreadCard thread={thread} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="answered" className="space-y-4">
            {bookmarkedThreads
              .filter((t) => t.hasAcceptedAnswer)
              .map((thread) => (
                <div key={thread.id} className="relative group">
                  <ThreadCard thread={thread} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {bookmarkedThreads
              .filter((t) => t.hasAiResponse)
              .map((thread) => (
                <div key={thread.id} className="relative group">
                  <ThreadCard thread={thread} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
