import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AiSummaryProps {
  summary: string
}

export function AiSummary({ summary }: AiSummaryProps) {
  return (
    <Card className="border-accent/50 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  )
}
