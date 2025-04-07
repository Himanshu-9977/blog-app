"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { AnimatePresence, motion } from "framer-motion"
import CommentItem from "./CommentItem"

interface Comment {
  _id: string
  content: string
  author: string
  authorName: string
  authorImageUrl?: string
  createdAt: string
  likes: string[]
  replies?: Comment[]
}

interface CommentListProps {
  comments: Comment[]
  postId: string
}

export default function CommentList({ comments, postId }: CommentListProps) {
  const { userId } = useAuth()
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="comment-thread">
          <CommentItem
            comment={comment}
            postId={postId}
            currentUserId={userId || undefined}
            isExpanded={expandedComments.has(comment._id)}
            onToggleReplies={() => toggleReplies(comment._id)}
          />

          {comment.replies && comment.replies.length > 0 && (
            <AnimatePresence>
              {expandedComments.has(comment._id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-12 mt-4 space-y-4 border-l-2 border-muted pl-4"
                >
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply._id} comment={reply} postId={postId} currentUserId={userId || undefined} isReply />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  )
}

