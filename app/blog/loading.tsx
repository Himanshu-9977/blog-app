import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { BlogPageSkeleton } from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container py-12">
        <BlogPageSkeleton />
      </main>
      <Footer />
    </div>
  )
}
