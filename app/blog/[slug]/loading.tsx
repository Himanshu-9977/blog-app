import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { BlogPostSkeleton } from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-12">
        <BlogPostSkeleton />
      </main>
      <Footer />
    </div>
  )
}
