"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export default function TagsInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    }
    
    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const addTag = (tag: string) => {
    // Normalize tag (lowercase, no special chars except dash)
    const normalizedTag = tag
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, "")
      .trim()
    
    // Don't add empty tags, duplicates, or exceed max
    if (
      normalizedTag &&
      !value.includes(normalizedTag) &&
      value.length < maxTags
    ) {
      const newTags = [...value, normalizedTag]
      onChange(newTags)
    }
    
    // Clear input
    setInputValue("")
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div 
      className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
      onClick={handleContainerClick}
    >
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs py-1 px-2">
          {tag}
          <button
            type="button"
            className="ml-1 rounded-full hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(index)
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            addTag(inputValue.trim())
          }
        }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] border-0 p-0 h-7 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}
