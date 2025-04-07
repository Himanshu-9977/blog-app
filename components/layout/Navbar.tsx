"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Menu, Search } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { searchPosts } from "@/lib/actions/posts"
import { Card, CardContent } from "@/components/ui/card"

// Define post type
interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  authorInfo?: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    username: string | null
    fullName: string
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  // Handle search input changes
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim().length === 0) {
      setSearchResults([])
      setShowResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    try {
      const results = await searchPosts(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching posts:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex py-6 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold text-xl flex items-center">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Blog Platform
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/blog" || pathname.startsWith("/blog/") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Blog
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" || pathname.startsWith("/dashboard/")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            </SignedIn>
          </nav>
        </div>

        <div className="hidden md:flex items-center relative max-w-sm" ref={searchRef}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="w-[200px] lg:w-[300px] pl-8 rounded-full bg-muted"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {showResults && (
            <Card className="absolute top-full mt-1 w-full z-50 max-h-[400px] overflow-auto">
              <CardContent className="p-2">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="block p-2 hover:bg-muted rounded-md"
                        onClick={() => setShowResults(false)}
                      >
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No results found</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignedIn>
            <UserButton signInUrl="/sign-in" />
          </SignedIn>
          <SignedOut>
            <div className="hidden md:flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full px-4">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="py-4">
                <Link href="/" className="font-bold text-xl flex items-center mb-6">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Blog Platform
                  </span>
                </Link>
                <div className="relative mb-6" ref={searchRef}>
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    className="w-full pl-8 bg-muted"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {showResults && (
                    <Card className="absolute top-full mt-1 w-full z-50 max-h-[300px] overflow-auto">
                      <CardContent className="p-2">
                        {isSearching ? (
                          <div className="p-4 text-center text-muted-foreground">Searching...</div>
                        ) : searchResults.length > 0 ? (
                          <div className="space-y-2">
                            {searchResults.map((post) => (
                              <Link
                                key={post._id}
                                href={`/blog/${post.slug}`}
                                className="block p-2 hover:bg-muted rounded-md"
                                onClick={() => setShowResults(false)}
                              >
                                <h3 className="font-medium">{post.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-muted-foreground">No results found</div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
                <nav className="flex flex-col gap-4">
                  <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                    Home
                  </Link>
                  <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                    Blog
                  </Link>
                  <SignedIn>
                    <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <Link href="/sign-in" className="text-sm font-medium transition-colors hover:text-primary">
                      Sign In
                    </Link>
                    <Link href="/sign-up" className="text-sm font-medium transition-colors hover:text-primary">
                      Sign Up
                    </Link>
                  </SignedOut>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

