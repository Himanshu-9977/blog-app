import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import PostForm from "@/components/post-form"

// Categories have been removed from the app

export default async function NewPostPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
            <p className="text-muted-foreground">Fill out the form below to create a new blog post.</p>
          </div>

          <PostForm />
        </main>
      </div>
      <Footer />
    </div>
  )
}

