import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { FormSkeleton } from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted/50 rounded-md animate-pulse mb-2" />
            <div className="h-5 w-96 max-w-full bg-muted/50 rounded-md animate-pulse" />
          </div>
          <FormSkeleton />
        </main>
      </div>
      <Footer />
    </div>
  )
}
