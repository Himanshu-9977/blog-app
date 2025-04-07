import mongoose, { Schema, type Document } from "mongoose"

export interface IImage extends Document {
  filename: string
  contentType: string
  data: Buffer
  createdAt: Date
  updatedAt: Date
}

const ImageSchema: Schema = new Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema)
