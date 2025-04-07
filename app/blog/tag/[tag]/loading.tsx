import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { BlogPageSkeleton } from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 bg-muted/50 rounded-md animate-pulse" />
                <div className="h-8 w-48 bg-muted/50 rounded-md animate-pulse" />
              </div>
              <div className="h-5 w-32 bg-muted/50 rounded-md animate-pulse" />
            </div>
            <BlogPageSkeleton />
          </div>
          <div className="md:w-1/4">
            <div className="bg-card rounded-lg p-6 border">
              <div className="h-6 w-32 bg-muted/50 rounded-md animate-pulse mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 w-16 bg-muted/50 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
