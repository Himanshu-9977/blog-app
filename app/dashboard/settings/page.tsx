import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { DashboardNav } from "@/components/dashboard/DashboardNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.firstName + " " + user?.lastName} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.emailAddresses[0]?.emailAddress} disabled />
              </div>
              <div className="pt-4">
                <Button asChild>
                  <a href="https://accounts.clerk.dev/user/profile" target="_blank" rel="noopener noreferrer">
                    Manage Profile on Clerk
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification preferences coming soon.</p>
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  )
}

