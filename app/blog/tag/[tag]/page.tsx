import Link from "next/link"
import { notFound } from "next/navigation"
import { Tag } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import PostCard from "@/components/PostCard"
import { Button } from "@/components/ui/button"
import { getPostsByTag, getPopularTags } from "@/lib/actions/tags"

type TagPageProps = {
  params: {
    tag: string
  }
  searchParams: {
    page?: string
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = params
  const decodedTag = decodeURIComponent(tag)
  const currentPage = Number(searchParams.page) || 1
  const pageSize = 9

  const { posts, totalPosts } = await getPostsByTag(decodedTag, currentPage, pageSize)

  if (currentPage > 1 && posts.length === 0) {
    notFound()
  }

  // Get popular tags for sidebar
  const popularTags = await getPopularTags(10)

  const totalPages = Math.ceil(totalPosts / pageSize)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-5 w-5" />
                <h1 className="text-3xl font-bold">#{decodedTag}</h1>
              </div>
              <p className="text-muted-foreground">
                {totalPosts} {totalPosts === 1 ? "post" : "posts"} with this tag
              </p>
            </div>

            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: any) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="flex gap-2">
                      {currentPage > 1 && (
                        <Button asChild variant="outline">
                          <Link href={`/blog/tag/${tag}?page=${currentPage - 1}`}>Previous</Link>
                        </Button>
                      )}

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          asChild={currentPage !== page}
                        >
                          {currentPage !== page ? (
                            <Link href={`/blog/tag/${tag}?page=${page}`}>{page}</Link>
                          ) : (
                            page
                          )}
                        </Button>
                      ))}

                      {currentPage < totalPages && (
                        <Button asChild variant="outline">
                          <Link href={`/blog/tag/${tag}?page=${currentPage + 1}`}>Next</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No posts found with this tag.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.length > 0 ? (
                  popularTags.map((tagItem: { _id: string; count: number }) => (
                    <Link
                      key={tagItem._id}
                      href={`/blog/tag/${encodeURIComponent(tagItem._id)}`}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        tagItem._id === decodedTag
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      #{tagItem._id}
                      <span className="ml-1 text-xs">({tagItem.count})</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No tags found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
