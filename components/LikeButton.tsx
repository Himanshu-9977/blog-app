"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleLikePost } from "@/lib/actions/posts"
import { toast } from "sonner"

interface LikeButtonProps {
  postId: string
  initialLikes: string[]
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { userId, isSignedIn } = useAuth()
  const router = useRouter()

  const [likes, setLikes] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  const hasLiked = userId ? likes.includes(userId) : false

  const handleLike = async () => {
    if (!isSignedIn) {
      return router.push("/sign-in")
    }

    setIsLoading(true)
    try {
      const result = await toggleLikePost(postId)
      if (result.error) {
        toast.error("Failed to like post")
      } else {
        if (result.liked) {
          setLikes([...likes, userId!])
        } else {
          setLikes(likes.filter((id) => id !== userId))
        }
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" className="h-auto p-0" onClick={handleLike} disabled={isLoading}>
        <Heart className={`h-4 w-4 ${hasLiked ? "fill-current text-red-500" : ""}`} />
      </Button>
      <span>{likes.length} likes</span>
    </div>
  )
}

