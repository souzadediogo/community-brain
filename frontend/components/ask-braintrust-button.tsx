"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"
import { BraintrustResponse } from "./braintrust-response"

export function AskBraintrustButton() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setShowResponse(true)
  }

  const handleClose = () => {
    setOpen(false)
    setShowResponse(false)
    setQuestion("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          Ask Braintrust
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        {!showResponse ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Ask Braintrust AI
              </DialogTitle>
              <DialogDescription>
                Get instant AI-powered answers from our knowledge base and community expertise.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="What would you like to know?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleAsk} disabled={!question.trim() || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Ask Braintrust
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <BraintrustResponse question={question} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
