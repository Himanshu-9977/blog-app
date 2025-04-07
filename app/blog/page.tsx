import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { getAllPosts } from "@/lib/actions/posts"
import { getPopularTags } from "@/lib/actions/tags"
import PostCard from "@/components/PostCard"
import TagSearch from "@/components/TagSearch"

export default async function BlogPage() {
  // Use try/catch to handle potential errors
  let posts = []
  let popularTags = []

  try {
    // Fetch posts and popular tags in parallel
    const [postsResult, tagsResult] = await Promise.all([
      getAllPosts(20),
      getPopularTags(10)
    ])

    posts = postsResult
    popularTags = tagsResult
  } catch (error) {
    console.error("Error fetching data:", error)
    // Continue with empty arrays
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Our Blog
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of articles, stories, and insights from our community.
          </p>
          <div className="mt-6 flex justify-center">
            <TagSearch popularTags={popularTags} />
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No posts available yet. Check back soon for new content!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

