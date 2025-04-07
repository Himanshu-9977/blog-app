"use client"

import { useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
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
    console.error("Blog page error:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container py-12 flex items-center justify-center">
        <ErrorMessage
          title="Failed to load blog posts"
          message="We couldn't load the blog posts. Please try again later."
          onRetry={reset}
        />
      </main>
      <Footer />
    </div>
  )
}
