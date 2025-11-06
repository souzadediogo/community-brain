"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/profile", label: "My Threads", icon: MessageSquare },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
]

const popularTags = [
  "Strategy",
  "Leadership",
  "Product",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "Technology",
  "HR",
  "Legal",
]

interface SidebarProps {
  selectedTags?: string[]
  onTagChange?: (tags: string[]) => void
}

export function Sidebar({ selectedTags = [], onTagChange }: SidebarProps) {
  const pathname = usePathname()

  const handleTagToggle = (tag: string) => {
    if (!onTagChange) return

    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagChange([...selectedTags, tag])
    }
  }

  return (
    <aside className="w-64 border-r bg-muted/10 h-[calc(100vh-4rem)] sticky top-16">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Navigation</h3>
            <nav className="space-y-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start gap-3", isActive && "bg-secondary")}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <Separator />

          {/* Tag Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Filter by Tags</h3>
              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={() => onTagChange?.([])}>
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {popularTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="text-sm font-normal cursor-pointer flex-1">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
