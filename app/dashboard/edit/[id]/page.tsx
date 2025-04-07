import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import mongoose from "mongoose"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import PostForm from "@/components/post-form"
import connectDB from "@/lib/db/mongoose"
import Post from "@/lib/db/models/postModel"
import { getUserById } from "@/lib/utils/clerk"

// Helper function to serialize MongoDB data
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

async function getPostById(id: string) {
  try {
    await connectDB()
    const post = await Post.findById(id)
    if (!post) return null

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
    console.error("Error fetching post:", error)
    return null
  }
}

// Categories have been removed from the app

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  // Check if the current user is the author of the post
  if (post.author !== userId) {
    redirect("/dashboard")
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Post</h1>
            <p className="text-muted-foreground">Make changes to your post and save when you're done.</p>
          </div>

          <PostForm initialData={post} postId={params.id} />
        </main>
      </div>
      <Footer />
    </div>
  )
}

