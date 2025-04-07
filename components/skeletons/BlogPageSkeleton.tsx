import { PostCardSkeleton } from "./PostCardSkeleton"

export function BlogPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="h-12 w-48 bg-muted/50 rounded-md animate-pulse mx-auto" />
        <div className="h-5 w-96 max-w-full bg-muted/50 rounded-md animate-pulse mx-auto" />
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
