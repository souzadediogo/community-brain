"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles } from "lucide-react"

const SUGGESTED_TAGS = [
  "SaaS",
  "Scaling",
  "Infrastructure",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Leadership",
  "Product",
  "Engineering",
  "AI",
  "Strategy",
  "Operations",
  "Legal",
  "Fundraising",
]

export default function NewThreadPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim()) && tags.length < 5) {
      setTags([...tags, customTag.trim()])
      setCustomTag("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log("[v0] Creating thread:", { title, content, tags })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to home or new thread
    router.push("/")
  }

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && tags.length > 0

  return (
    <div className="container py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">
            Get expert insights and AI-powered answers from the Braintrust community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Question Title</CardTitle>
              <CardDescription>Be specific and clear. Good titles get better answers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., What are the best practices for scaling a SaaS product?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
                maxLength={200}
              />
              <div className="mt-2 text-xs text-muted-foreground text-right">{title.length}/200</div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Provide context, background, and what you've tried so far.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your situation in detail. The more context you provide, the better answers you'll receive..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none"
                maxLength={5000}
              />
              <div className="mt-2 text-xs text-muted-foreground text-right">{content.length}/5000</div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add up to 5 tags to help experts find your question. Select from suggestions or add your own.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Tags */}
              {tags.length < 5 && (
                <>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Suggested Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag)).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Custom Tag Input */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Or add a custom tag</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter custom tag"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCustomTag()
                          }
                        }}
                        maxLength={20}
                      />
                      <Button type="button" variant="outline" onClick={addCustomTag} disabled={!customTag.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Assistant Notice */}
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">AI-Powered Assistance</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI assistant will analyze your question and provide initial insights while we notify relevant
                    experts in the community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
