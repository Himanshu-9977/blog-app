"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"

interface TagSearchProps {
  popularTags?: { _id: string; count: number }[]
}

export default function TagSearch({ popularTags = [] }: TagSearchProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Focus input when popover opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      // Clean the tag (lowercase, remove special chars except dash)
      const cleanTag = searchValue
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "")
        .trim()
      
      if (cleanTag) {
        router.push(`/blog/tag/${encodeURIComponent(cleanTag)}`)
        setIsOpen(false)
        setSearchValue("")
      }
    }
  }

  const handleTagClick = (tag: string) => {
    router.push(`/blog/tag/${encodeURIComponent(tag)}`)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Tag className="h-4 w-4" />
          <span>Find by Tag</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-medium">Search by Tag</h3>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Enter a tag..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={() => setSearchValue("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          {popularTags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag._id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleTagClick(tag._id)}
                  >
                    #{tag._id}
                    <span className="ml-1 text-xs">({tag.count})</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
