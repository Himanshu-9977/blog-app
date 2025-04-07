"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/db/mongoose"
import Post from "@/lib/db/models/postModel"
import { postSchema, type PostFormValues } from "@/lib/schemas/post"
import Comment from "@/lib/db/models/commentModel"
import { getUserById } from "@/lib/utils/clerk"

// Helper function to serialize MongoDB data
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

export async function createPost(formData: PostFormValues) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const validatedFields = postSchema.safeParse(formData)
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    await connectDB()

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const newPost = new Post({
      ...validatedFields.data,
      slug,
      author: userId,
    })

    await newPost.save()

    revalidatePath("/dashboard")
    revalidatePath("/blog")

    // Convert ObjectId to string before returning
    return { success: true, postId: newPost._id.toString() }
  } catch (error) {
    return { error: "Failed to create post" }
  }
}

export async function updatePost(postId: string, formData: PostFormValues) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const validatedFields = postSchema.safeParse(formData)
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    await connectDB()

    const post = await Post.findById(postId)
    if (!post) {
      return { error: "Post not found" }
    }

    if (post.author !== userId) {
      return { error: "Unauthorized" }
    }

    Object.assign(post, validatedFields.data)
    await post.save()

    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/dashboard")
    revalidatePath("/blog")

    // Return string version of postId
    return { success: true, postId: postId.toString() }
  } catch (error) {
    return { error: "Failed to update post" }
  }
}

export async function deletePost(postId: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await connectDB()

    const post = await Post.findById(postId)
    if (!post) {
      return { error: "Post not found" }
    }

    if (post.author !== userId) {
      return { error: "Unauthorized" }
    }

    await Post.findByIdAndDelete(postId)

    revalidatePath("/dashboard")
    revalidatePath("/blog")

    return { success: true }
  } catch (error) {
    return { error: "Failed to delete post" }
  }
}

export async function getPost(slug: string) {
  try {
    await connectDB()

    const post = await Post.findOne({ slug })
    if (!post) {
      return null
    }

    // Get author information
    let authorInfo = null
    try {
      authorInfo = await getUserById(post.author)
    } catch (error) {
      console.error("Error fetching author info:", error)
      // Continue with null authorInfo
    }

    // Serialize the post data and add author information
    const serializedPost = serializeData(post)
    return {
      ...serializedPost,
      authorInfo
    }
  } catch (error) {
    console.error("Failed to fetch post:", error)
    throw new Error("Failed to fetch post")
  }
}

export async function getAllPosts(limit = 10, published = true) {
  try {
    await connectDB()

    const query = published ? { published: true } : {}
    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(limit)

    if (!posts || posts.length === 0) {
      return []
    }

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        let authorInfo = null
        try {
          authorInfo = await getUserById(post.author)
        } catch (error) {
          console.error("Error fetching author info:", error)
          // Continue with null authorInfo
        }

        const serializedPost = serializeData(post)
        return {
          ...serializedPost,
          authorInfo
        }
      })
    )

    return postsWithAuthors
  } catch (error) {
    console.error("Error fetching posts:", error)
    return [] // Return empty array instead of throwing error
  }
}

export async function getUserPosts(limit = 10) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await connectDB()

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }).limit(limit)

    if (!posts || posts.length === 0) {
      return []
    }

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        let authorInfo = null
        try {
          authorInfo = await getUserById(post.author)
        } catch (error) {
          console.error("Error fetching author info:", error)
          // Continue with null authorInfo
        }

        const serializedPost = serializeData(post)
        return {
          ...serializedPost,
          authorInfo
        }
      })
    )

    return postsWithAuthors
  } catch (error) {
    console.error("Failed to fetch user posts:", error)
    throw new Error("Failed to fetch user posts")
  }
}

export async function toggleLikePost(postId: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await connectDB()

    const post = await Post.findById(postId)
    if (!post) {
      return { error: "Post not found" }
    }

    const hasLiked = post.likes.includes(userId)

    if (hasLiked) {
      post.likes = post.likes.filter((id: string) => id !== userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()

    revalidatePath(`/blog/${post.slug}`)

    return { success: true, liked: !hasLiked }
  } catch (error) {
    return { error: "Failed to like post" }
  }
}

export async function getPostsByCategory(categoryId: string, page = 1, pageSize = 9) {
  try {
    await connectDB()

    const skip = (page - 1) * pageSize

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({
      categories: categoryId,
      published: true,
    })

    // Get posts with pagination
    const posts = await Post.find({
      categories: categoryId,
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
    console.error("Error fetching posts by category:", error)
    return { posts: [], totalPosts: 0 }
  }
}

export async function getCategoryPostCounts() {
  try {
    await connectDB()

    // Aggregate to count posts per category
    const categoryCounts = await Post.aggregate([
      { $match: { published: true } },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ])

    // Convert to object with category ID as key
    const countMap: Record<string, number> = {}
    categoryCounts.forEach((item: { _id: string; count: number }) => {
      countMap[item._id] = item.count
    })

    return countMap
  } catch (error) {
    console.error("Error fetching category post counts:", error)
    return {}
  }
}

export async function incrementPostView(postId: string) {
  try {
    await connectDB()

    const post = await Post.findById(postId)
    if (!post) {
      return { error: "Post not found" }
    }

    // Increment the view count
    post.views = (post.views || 0) + 1
    await post.save()

    return { success: true, views: post.views }
  } catch (error) {
    console.error("Error incrementing post view:", error)
    return { error: "Failed to increment view" }
  }
}

export async function searchPosts(query: string) {
  if (!query || query.trim() === "") {
    return []
  }

  try {
    await connectDB()

    // Create a case-insensitive regex for the search query
    const searchRegex = new RegExp(query, "i")

    // Search in title, content, and excerpt
    const posts = await Post.find({
      published: true,
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { excerpt: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10)

    if (!posts || posts.length === 0) {
      return []
    }

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        let authorInfo = null
        try {
          authorInfo = await getUserById(post.author)
        } catch (error) {
          console.error("Error fetching author info:", error)
          // Continue with null authorInfo
        }

        const serializedPost = serializeData(post)
        return {
          ...serializedPost,
          authorInfo
        }
      })
    )

    return postsWithAuthors
  } catch (error) {
    console.error("Error searching posts:", error)
    return []
  }
}

