import mongoose, { Schema, type Document } from "mongoose"

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  author: string // Clerk user ID
  categories?: string[] // Kept for backward compatibility
  tags: string[]
  published: boolean
  views: number
  likes: string[] // Array of user IDs
  createdAt: Date
  updatedAt: Date
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    featuredImage: { type: String },
    author: { type: String, required: true },
    categories: [{ type: String }],
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: [{ type: String }],
  },
  { timestamps: true },
)

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)

