import { auth } from "@clerk/nextjs/server"
import { getPostComments } from "@/lib/actions/comments"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CommentSectionProps {
  postId: string
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  const { userId } = await auth()

  // Fetch comments
  let comments = []
  try {
    comments = await getPostComments(postId)
  } catch (error) {
    console.error("Error fetching comments:", error)
    // Continue with empty comments array
  }

  return (
    <Card className="border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          Comments
          <span className="text-sm font-normal text-muted-foreground">({comments?.length || 0})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {userId ? (
          <div className="mb-8">
            <CommentForm postId={postId} />
          </div>
        ) : (
          <div className="mb-8 p-4 bg-muted/50 rounded-lg text-center">
            <p>
              <a href="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </a>{" "}
              to join the conversation.
            </p>
          </div>
        )}

        <CommentList comments={comments || []} postId={postId} />
      </CardContent>
    </Card>
  )
}

