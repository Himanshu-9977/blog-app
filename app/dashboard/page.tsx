import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { BarChart3, Edit3, Eye, Heart, MessageSquare, PenLine, Plus } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import DeletePostButton from "@/components/dashboard/DeletePostButton"
import { getUserPosts } from "@/lib/actions/posts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Add error handling for getUserPosts
  let posts = []
  try {
    posts = await getUserPosts()
  } catch (error) {
    console.error("Error fetching user posts:", error)
    // Continue with empty posts array
  }

  const publishedPosts = posts.filter((post) => post.published)
  const draftPosts = posts.filter((post) => !post.published)

  // Calculate total views and likes with null checks
  const totalViews = posts.reduce((total, post) => total + (post?.views || 0), 0)
  const totalLikes = posts.reduce((total, post) => total + (post?.likes?.length || 0), 0)

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Toaster />
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your posts and track performance</p>
            </div>
            <Button asChild className="gap-1">
              <a href="/dashboard/new-post">
                <Plus className="h-4 w-4" />
                New Post
              </a>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
            <Card className="bg-gradient-to-br from-background to-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <PenLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {publishedPosts.length} published, {draftPosts.length} drafts
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-background to-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all your published posts</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-background to-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLikes}</div>
                <p className="text-xs text-muted-foreground mt-1">Engagement across all posts</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-background to-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground mt-1">Reader engagement on your content</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Post Analytics</CardTitle>
                <CardDescription>View performance metrics for your content</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart3 className="h-10 w-10 mb-2" />
                  <p>Analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="mt-8">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Posts</CardTitle>
                  <CardDescription>Manage all your blog posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <div
                          key={post._id}
                          className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{post.title}</h3>
                              {post.published ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              {new Date(post.createdAt).toLocaleDateString()} • {post.likes?.length || 0} likes
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                              <a href={`/dashboard/edit/${post._id}`}>
                                <Edit3 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </a>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">View</span>
                              </a>
                            </Button>
                            <DeletePostButton postId={post._id} postTitle={post.title} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't created any posts yet.</p>
                        <Button asChild className="mt-4">
                          <a href="/dashboard/new-post">Create your first post</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="published" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Published Posts</CardTitle>
                  <CardDescription>Posts that are live on your blog</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publishedPosts.length > 0 ? (
                      publishedPosts.map((post) => (
                        <div
                          key={post._id}
                          className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(post.createdAt).toLocaleDateString()} • {post.views || 0} views •{" "}
                              {post.likes?.length || 0} likes
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                              <a href={`/dashboard/edit/${post._id}`}>
                                <Edit3 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </a>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">View</span>
                              </a>
                            </Button>
                            <DeletePostButton postId={post._id} postTitle={post.title} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">You haven't published any posts yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="drafts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Posts</CardTitle>
                  <CardDescription>Posts you're still working on</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {draftPosts.length > 0 ? (
                      draftPosts.map((post) => (
                        <div
                          key={post._id}
                          className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Last updated: {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                              <a href={`/dashboard/edit/${post._id}`}>
                                <Edit3 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </a>
                            </Button>
                            <Button asChild variant="default" size="sm" className="h-8">
                              <a href={`/dashboard/publish/${post._id}`}>Publish</a>
                            </Button>
                            <DeletePostButton postId={post._id} postTitle={post.title} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">You don't have any drafts.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  )
}

