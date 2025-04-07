"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import TipTapEditor from "./TipTapEditor"
import FeaturedImageUpload from "./FeaturedImageUpload"
import TagsInput from "./TagsInput"
import { postSchema, type PostFormValues } from "@/lib/schemas/post"
import { createPost, updatePost } from "@/lib/actions/posts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface PostFormProps {
  initialData?: any
  postId?: string
}

export default function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      categories: [],
      tags: [],
      published: false,
    },
  })

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true)
    try {
      if (postId) {
        // Update existing post
        const result = await updatePost(postId, values)
        if (result.error) {
          toast.error("Failed to update post", {
            description: typeof result.error === "string" ? result.error : "Please check your form inputs",
          })
        } else {
          toast.success("Post updated successfully", {
            description: "Your post has been updated and saved",
          })
          router.push("/dashboard")
        }
      } else {
        // Create new post
        const result = await createPost(values)
        if (result.error) {
          toast.error("Failed to create post", {
            description: typeof result.error === "string" ? result.error : "Please check your form inputs",
          })
        } else {
          toast.success("Post created successfully", {
            description: "Your new post has been created",
          })
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form is ready

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6 md:col-span-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} className="text-lg" />
                  </FormControl>
                  <FormDescription>Create a compelling title (5-100 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of your post"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This will appear in post previews (10-200 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6 md:col-span-1">
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    <FeaturedImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Upload an image for your post</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TipTapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Write your post content using the rich text editor (minimum 50 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Type and press Enter to add tags"
                />
              </FormControl>
              <FormDescription>Add tags to help readers find your post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish</FormLabel>
                <p className="text-sm text-muted-foreground">This post will be visible to all users</p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingSpinner size="sm" text={postId ? "Updating..." : "Creating..."} className="justify-start" />
            ) : postId ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

