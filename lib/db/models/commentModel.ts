import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
  content: string;
  author: string; // Clerk user ID
  authorName: string; // Display name
  authorImageUrl?: string; // Profile image
  post: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId; // For nested replies
  isReply: boolean;
  likes: string[]; // Array of user IDs who liked this comment
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorName: { type: String, required: true },
    authorImageUrl: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    isReply: { type: Boolean, default: false },
    likes: [{ type: String }],
  },
  { timestamps: true }
)

// Add indexes for faster queries
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
