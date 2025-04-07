"use client"

import { useState, useTransition } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, Reply, Trash2, MoreVertical } from 'lucide-react'
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CommentForm from "./CommentForm"
import { deleteComment, likeComment } from "@/lib/actions/comments"

interface CommentItemProps {
  comment: {
    _id: string
    content: string
    author: string
    authorName: string
    authorImageUrl?: string
    createdAt: string
    likes: string[]
    replies?: any[]
  }
  postId: string
  currentUserId?: string
  isReply?: boolean
  isExpanded?: boolean
  onToggleReplies?: () => void
}

export default function CommentItem({
  comment,
  postId,
  currentUserId,
  isReply = false,
  isExpanded,
  onToggleReplies,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [optimisticLikes, setOptimisticLikes] = useState(comment.likes)
  
  const hasLiked = currentUserId ? optimisticLikes.includes(currentUserId) : false
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
  const isAuthor = currentUserId === comment.author
  const hasReplies = comment.replies && comment.replies.length > 0
  
  const authorInitials = comment.authorName
    ? comment.authorName.split(" ").map((n) => n[0]).join("")
    : "U"
  
  const handleLike = () => {
    if (!currentUserId) {
      toast.error("You must be signed in to like comments")
      return
    }
    
    // Optimistic update
    setOptimisticLikes((prev) => {
      if (prev.includes(currentUserId)) {
        return prev.filter((id) => id !== currentUserId)
      } else {
        return [...prev, currentUserId]
      }
    })
    
    startTransition(async () => {
      const result = await likeComment(comment._id)
      
      if (result.error) {
        // Revert optimistic update on error
        setOptimisticLikes(comment.likes)
        toast.error(result.error)
      }
    })
  }
  
  const handleDelete = () => {
    if (!isAuthor) return
    
    if (confirm("Are you sure you want to delete this comment?")) {
      startTransition(async () => {
        const result = await deleteComment(comment._id)
        
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Comment deleted")
        }
      })
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorImageUrl} alt={comment.authorName} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          
          <div className="text-sm">
            {comment.content}
          </div>
          
          <div className="flex items-center gap-4 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-0 ${hasLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{optimisticLikes.length}</span>
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="h-4 w-4 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
            
            {hasReplies && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground"
                onClick={onToggleReplies}
              >
                <span className="text-xs">
                  {isExpanded ? "Hide replies" : `Show ${comment.replies?.length} ${comment.replies?.length === 1 ? "reply" : "replies"}`}
                </span>
              </Button>
            )}
          </div>
          
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={postId}
                parentId={comment._id}
                onSuccess={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
                buttonText="Reply"
                autoFocus
              />
            </div>
          )}
        </div>
        
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  )
}
