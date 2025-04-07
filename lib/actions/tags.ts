"use server"

import connectDB from "@/lib/db/mongoose"
import Post from "@/lib/db/models/postModel"
import Comment from "@/lib/db/models/commentModel"
import { getUserById } from "@/lib/utils/clerk"

// Helper function to serialize MongoDB data
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

export async function getPostsByTag(tag: string, page = 1, pageSize = 9) {
  try {
    await connectDB()

    const skip = (page - 1) * pageSize

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({
      tags: tag,
      published: true,
    })

    // Get posts with pagination
    const posts = await Post.find({
      tags: tag,
      published: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()

    // Add comment count and author info to each post
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id })

        // Get author information
        let authorInfo = null
        try {
          authorInfo = await getUserById(post.author)
        } catch (error) {
          console.error("Error fetching author info:", error)
          // Continue with null authorInfo
        }

        return { ...post, commentCount, authorInfo }
      }),
    )

    return {
      posts: serializeData(postsWithDetails),
      totalPosts,
    }
  } catch (error) {
    console.error("Error fetching posts by tag:", error)
    return { posts: [], totalPosts: 0 }
  }
}

export async function getPopularTags(limit = 10) {
  try {
    await connectDB()

    // Aggregate to count posts per tag
    const tagCounts = await Post.aggregate([
      { $match: { published: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])

    return serializeData(tagCounts)
  } catch (error) {
    console.error("Error fetching popular tags:", error)
    return []
  }
}
