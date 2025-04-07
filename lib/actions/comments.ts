"use server"

import { revalidatePath } from "next/cache"
import { auth, currentUser } from "@clerk/nextjs/server"
import { z } from "zod"
import mongoose from "mongoose"
import connectDB from "@/lib/db/mongoose"
import Comment from "@/lib/db/models/commentModel"
import Post from "@/lib/db/models/postModel"

// Helper function to serialize MongoDB data
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
  postId: z.string(),
  parentId: z.string().optional(),
})

export async function addComment(formData: FormData) {
  const { userId } = await auth()
  if (!userId) {
    return { error: "You must be signed in to comment" }
  }

  const user = await currentUser()
  if (!user) {
    return { error: "User not found" }
  }

  const content = formData.get("content") as string
  const postId = formData.get("postId") as string
  const parentId = formData.get("parentId") as string | undefined

  const validatedFields = commentSchema.safeParse({
    content,
    postId,
    parentId: parentId || undefined,
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    await connectDB()

    // Verify post exists
    const post = await Post.findById(postId)
    if (!post) {
      return { error: "Post not found" }
    }

    // Create new comment
    const newComment = new Comment({
      content,
      author: userId,
      authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous",
      authorImageUrl: user.imageUrl,
      post: new mongoose.Types.ObjectId(postId),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : undefined,
      isReply: !!parentId,
      likes: [],
    })

    await newComment.save()

    revalidatePath(`/blog/${post.slug}`)
    return { success: true, commentId: newComment._id.toString() }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { error: "Failed to add comment" }
  }
}

export async function getPostComments(postId: string) {
  try {
    await connectDB()

    // Get top-level comments (not replies)
    const comments = await Comment.find({
      post: new mongoose.Types.ObjectId(postId),
      isReply: false,
    })
      .sort({ createdAt: -1 })
      .lean()

    // Get all replies
    const replies = await Comment.find({
      post: new mongoose.Types.ObjectId(postId),
      isReply: true,
    })
      .sort({ createdAt: 1 })
      .lean()

    // Group replies by parent comment
    const repliesByParent = replies.reduce<Record<string, any[]>>((acc, reply) => {
      const parentId = reply.parentId.toString()
      if (!acc[parentId]) {
        acc[parentId] = []
      }
      acc[parentId].push(reply)
      return acc
    }, {})

    // Add replies to their parent comments
    const commentsWithReplies = comments.map((comment: any) => {
      const commentId = comment._id.toString()
      return {
        ...comment,
        replies: repliesByParent[commentId] || [],
      }
    })

    return serializeData(commentsWithReplies)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function deleteComment(commentId: string) {
  const { userId } = await auth()
  if (!userId) {
    return { error: "Unauthorized" }
  }

  try {
    await connectDB()

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return { error: "Comment not found" }
    }

    // Check if user is the author of the comment
    if (comment.author !== userId) {
      return { error: "You can only delete your own comments" }
    }

    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [{ _id: commentId }, { parentId: commentId }],
    })

    // Get the post to revalidate the path
    const post = await Post.findById(comment.post)
    if (post) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting comment:", error)
    return { error: "Failed to delete comment" }
  }
}

export async function likeComment(commentId: string) {
  const { userId } = await auth()
  if (!userId) {
    return { error: "Unauthorized" }
  }

  try {
    await connectDB()

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return { error: "Comment not found" }
    }

    const hasLiked = comment.likes.includes(userId)

    if (hasLiked) {
      // Unlike
      comment.likes = comment.likes.filter((id: string) => id !== userId)
    } else {
      // Like
      comment.likes.push(userId)
    }

    await comment.save()

    // Get the post to revalidate the path
    const post = await Post.findById(comment.post)
    if (post) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true, liked: !hasLiked, likes: comment.likes.length }
  } catch (error) {
    console.error("Error liking comment:", error)
    return { error: "Failed to like comment" }
  }
}

