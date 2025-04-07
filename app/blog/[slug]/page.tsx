import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, Clock, Eye, Tag, User } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { getPost, incrementPostView } from "@/lib/actions/posts"
import LikeButton from "@/components/LikeButton"
import CommentSection from "@/components/comments/CommentSection"

import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // Increment view count
  if (post._id) {
    await incrementPostView(post._id)
  }

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  })

  // Calculate estimated reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container py-12">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 text-center">
            {/* <div className="flex items-center justify-center gap-2 mb-4">
              {post.categories && post.categories.length > 0 && (
                <Badge variant="secondary" className="px-3 py-1 text-xs">
                  {post.categories[0]}
                </Badge>
              )}
            </div> */}

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              {post.title}
            </h1>

            <div className="flex items-center justify-center text-sm text-muted-foreground gap-4 flex-wrap">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.authorInfo?.fullName || 'Unknown User'}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{post.views || 0} views</span>
              </div>
              <LikeButton postId={post._id} initialLikes={post.likes} />
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-[500px] mb-10 rounded-xl overflow-hidden shadow-xl">
              <Image
                src={post.featuredImage || "/placeholder.svg?height=500&width=1000"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <a
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 rounded-full")}
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-12" />

          {/* Comments */}
          <div className="mt-12">
            <CommentSection postId={post._id} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

