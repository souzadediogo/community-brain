import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"

interface PopularTag {
  name: string
  count: number
}

const popularTags: PopularTag[] = [
  { name: "Strategy", count: 156 },
  { name: "Leadership", count: 142 },
  { name: "Product", count: 128 },
  { name: "Marketing", count: 98 },
  { name: "Sales", count: 87 },
  { name: "Finance", count: 76 },
  { name: "Operations", count: 64 },
  { name: "Technology", count: 59 },
  { name: "HR", count: 52 },
  { name: "Legal", count: 41 },
]

export function PopularTags() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Popular Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link key={tag.name} href={`/search?tags=${encodeURIComponent(tag.name)}`}>
              <Badge
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {tag.name}
                <span className="ml-1.5 text-xs opacity-70">({tag.count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
