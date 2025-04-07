import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageSquare, User, Tag } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  post: {
    _id: string
    title: string
    slug: string
    excerpt: string
    featuredImage?: string
    createdAt: string
    author: string
    likes: string[]
    categories?: string[]
    tags?: string[]
    commentCount?: number
    authorInfo?: {
      id: string
      firstName: string | null
      lastName: string | null
      imageUrl: string | null
      username: string | null
      fullName: string
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  })

  return (
    <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video relative overflow-hidden">
        <Link href={`/blog/${post.slug}`}>
          <div className="relative w-full h-48">
            <Image
              src={post.featuredImage || "/placeholder.svg?height=192&width=384"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* {post.categories && post.categories.length > 0 && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {post.categories[0]}
                </Badge>
              </div>
            )} */}
          </div>
        </Link>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="line-clamp-2 text-xl">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex items-center mb-2 text-xs text-muted-foreground">
          <User className="h-3 w-3 mr-1" />
          <span>{post.authorInfo?.fullName || 'Unknown User'}</span>
        </div>
        <p className="line-clamp-3 text-muted-foreground text-sm">{post.excerpt}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            <Tag className="h-3 w-3 text-muted-foreground mr-1" />
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs py-0 px-1.5">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs py-0 px-1.5">+{post.tags.length - 3}</Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-4 text-xs text-muted-foreground border-t mt-auto">
        <div className="flex justify-between w-full items-center">
          <span>{formattedDate}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Heart className="h-3.5 w-3.5 mr-1" />
              <span>{post.likes.length}</span>
            </div>
            {post.commentCount !== undefined && (
              <div className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                <span>{post.commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

