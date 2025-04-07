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
    console.error("Tag page error:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-10 flex items-center justify-center">
        <ErrorMessage
          title="Failed to load tag posts"
          message="We couldn't load the posts for this tag. Please try again later."
          onRetry={reset}
        />
      </main>
      <Footer />
    </div>
  )
}
