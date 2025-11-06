"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sparkles, ExternalLink, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState } from "react"

interface BraintrustResponseProps {
  question: string
  onClose: () => void
}

export function BraintrustResponse({ question, onClose }: BraintrustResponseProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(mockResponse.answer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mock AI response data
  const mockResponse = {
    answer:
      "Based on the community discussions and expert insights, here's a comprehensive answer to your question:\n\nThe key considerations include understanding your target market, establishing clear value propositions, and building sustainable growth strategies. Many successful executives emphasize the importance of data-driven decision making and maintaining strong team alignment.\n\nAdditionally, it's crucial to focus on customer feedback loops and iterate quickly based on market responses. The most successful approaches combine strategic planning with tactical flexibility.",
    confidence: 0.92,
    sources: [
      {
        id: "1",
        title: "Best practices for scaling B2B SaaS companies",
        author: "Sarah Chen",
        excerpt: "Focus on customer retention and expansion revenue...",
        upvotes: 45,
      },
      {
        id: "2",
        title: "Strategic planning frameworks for executives",
        author: "Michael Rodriguez",
        excerpt: "Data-driven approaches to decision making...",
        upvotes: 38,
      },
      {
        id: "3",
        title: "Building high-performance teams in tech",
        author: "Emily Watson",
        excerpt: "Team alignment and clear communication are essential...",
        upvotes: 52,
      },
    ],
    recommendedExperts: [
      {
        id: "1",
        name: "Sarah Chen",
        title: "VP of Product",
        avatar: "/placeholder.svg?height=40&width=40",
        expertise: ["Product Strategy", "SaaS"],
      },
      {
        id: "2",
        name: "Michael Rodriguez",
        title: "CEO",
        avatar: "/placeholder.svg?height=40&width=40",
        expertise: ["Leadership", "Strategy"],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Braintrust AI</h3>
              <p className="text-xs text-muted-foreground">{Math.round(mockResponse.confidence * 100)}% confidence</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Your question: {question}</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-line">{mockResponse.answer}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Was this helpful?</span>
          <Button
            variant={feedback === "up" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setFeedback("up")}
          >
            <ThumbsUp className="h-3 w-3" />
          </Button>
          <Button
            variant={feedback === "down" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => setFeedback("down")}
          >
            <ThumbsDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Sources from Community</h4>
        <div className="space-y-2">
          {mockResponse.sources.map((source) => (
            <Card key={source.id} className="p-3">
              <Link href={`/threads/${source.id}`} className="group flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{source.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{source.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{source.author}</span>
                    <span>•</span>
                    <span>{source.upvotes} upvotes</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Recommended Experts</h4>
        <div className="space-y-2">
          {mockResponse.recommendedExperts.map((expert) => (
            <Link
              key={expert.id}
              href={`/profile/${expert.id}`}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
                <AvatarFallback>
                  {expert.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{expert.name}</p>
                <p className="text-xs text-muted-foreground">{expert.title}</p>
                <div className="flex gap-1 mt-1">
                  {expert.expertise.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button asChild>
          <Link href="/threads/new">Ask Community</Link>
        </Button>
      </div>
    </div>
  )
}
