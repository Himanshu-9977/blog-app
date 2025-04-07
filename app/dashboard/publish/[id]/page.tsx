import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/db/mongoose"
import Post from "@/lib/db/models/postModel"
import { revalidatePath } from "next/cache"

// This is a special page that immediately publishes a post and redirects back
// We're not rendering any UI here - it's just handling the publish action
export default async function PublishPostPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  try {
    await connectDB()

    const post = await Post.findById(params.id)
    if (!post) {
      redirect("/dashboard")
    }

    // Verify ownership
    if (post.author !== userId) {
      redirect("/dashboard")
    }

    // Update published status
    post.published = true
    await post.save()

    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
  } catch (error) {
    console.error("Error publishing post:", error)
  }

  // Redirect back to dashboard
  redirect("/dashboard")
}

