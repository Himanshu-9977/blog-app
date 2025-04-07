"use client"

import { useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { ErrorMessage } from "@/components/ui/error-message"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Edit post page error:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden items-center justify-center">
          <ErrorMessage
            title="Failed to load post"
            message="We couldn't load the post for editing. It may have been removed or you don't have permission to edit it."
            onRetry={reset}
          />
        </main>
      </div>
      <Footer />
    </div>
  )
}
