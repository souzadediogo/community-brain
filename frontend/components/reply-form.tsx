"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function ReplyForm() {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Reply submitted:", content)
    setContent("")
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your insights or ask for clarification..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setContent("")}>
              Cancel
            </Button>
            <Button type="submit" disabled={!content.trim()}>
              Post Reply
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
