import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(200, "Excerpt must be less than 200 characters"),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
})

export type PostFormValues = z.infer<typeof postSchema>

