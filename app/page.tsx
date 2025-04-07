import Link from "next/link"
import { ArrowRight, BookOpen, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { getAllPosts } from "@/lib/actions/posts"
import { getPopularTags } from "@/lib/actions/tags"
import PostCard from "@/components/PostCard"
import TagSearch from "@/components/TagSearch"

export default async function HomePage() {
  // Fetch posts and popular tags in parallel
  const [posts, popularTags] = await Promise.all([
    getAllPosts(6),
    getPopularTags(10)
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0" />
          <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  Discover Insights & Stories
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join our community of writers and readers sharing knowledge, experiences, and perspectives.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/blog">Explore Articles</Link>
                </Button>
                
                <TagSearch popularTags={popularTags} />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Engaging Content</h3>
                <p className="text-muted-foreground">
                  Discover thought-provoking articles written by experts and enthusiasts across various fields.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Active Community</h3>
                <p className="text-muted-foreground">
                  Join discussions, share perspectives, and connect with like-minded readers and writers.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <ThumbsUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Quality First</h3>
                <p className="text-muted-foreground">
                  We prioritize well-researched, thoughtful content that provides genuine value to our readers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Latest Articles</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Stay updated with our newest content from talented writers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="col-span-full text-center">
                  <p className="text-muted-foreground">No posts available yet.</p>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-12">
              <Button asChild variant="outline" className="group">
                <Link href="/blog" className="flex items-center">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

