import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Blog Platform",
  description: "A modern blog platform built with Next.js",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Container>
              {children}
              <Toaster position="top-right" />
            </Container>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}



import './globals.css'
import Container from "@/components/layout/Container"
