"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ThreadCard } from "@/components/thread-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { mockThreads } from "@/lib/mock-data"
import { Search, Filter, X, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ALL_TAGS = Array.from(new Set(mockThreads.flatMap((t) => t.tags)))

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAiOnly, setShowAiOnly] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
    setSearchInput(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInput)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedTags([])
    setShowAiOnly(false)
  }

  // Filter threads based on search and filters
  const filteredThreads = mockThreads.filter((thread) => {
    const matchesQuery =
      !query ||
      thread.title.toLowerCase().includes(query.toLowerCase()) ||
      thread.content.toLowerCase().includes(query.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => thread.tags.includes(tag))

    const matchesAi = !showAiOnly || thread.hasAiResponse

    return matchesQuery && matchesTags && matchesAi
  })

  const hasActiveFilters = selectedTags.length > 0 || showAiOnly

  return (
    <div className="container py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Search Questions</h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions, topics, or keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Tags
                  {selectedTags.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    >
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_TAGS.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={showAiOnly ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowAiOnly(!showAiOnly)}
            >
              <Sparkles className="h-4 w-4" />
              AI Answered
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="gap-2" onClick={clearFilters}>
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredThreads.length} {filteredThreads.length === 1 ? "result" : "results"}
            {query && ` for "${query}"`}
          </p>
        </div>

        {filteredThreads.length > 0 ? (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
