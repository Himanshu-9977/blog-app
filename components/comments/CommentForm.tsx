"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addComment } from "@/lib/actions/comments"

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: () => void
  placeholder?: string
  buttonText?: string
  autoFocus?: boolean
}

export default function CommentForm({
  postId,
  parentId,
  onSuccess,
  placeholder = "Add a comment...",
  buttonText = "Post Comment",
  autoFocus = false,
}: CommentFormProps) {
  const { userId, isSignedIn } = useAuth()
  // Since user is not available in the type, we'll create a fallback
  const auth = useAuth()
  const user = 'user' in auth ? auth.user : null
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSignedIn) {
      return router.push("/sign-in")
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    const formData = new FormData()
    formData.append("content", content)
    formData.append("postId", postId)
    if (parentId) {
      formData.append("parentId", parentId)
    }

    startTransition(async () => {
      const result = await addComment(formData)

      if (result.error) {
        toast.error(typeof result.error === "string" ? result.error : "Failed to post comment")
      } else {
        setContent("")
        if (formRef.current) formRef.current.reset()
        toast.success(parentId ? "Reply added" : "Comment added")
        if (onSuccess) onSuccess()
      }
    })
  }

  // Create fallback for user properties
  const userInitials = user && typeof user === 'object' && 'firstName' in user && 'lastName' in user && user.firstName && user.lastName
    ? `${String(user.firstName)[0]}${String(user.lastName)[0]}`
    : "U"

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user && typeof user === 'object' && 'imageUrl' in user ? user.imageUrl as string : undefined}
            alt={user && typeof user === 'object' && 'fullName' in user ? user.fullName as string : "User"}
          />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none focus-visible:ring-primary"
            autoFocus={autoFocus}
            disabled={isPending}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? (
            <LoadingSpinner size="sm" text="Posting..." className="justify-start" />
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </form>
  )
}
