import sharp from "sharp"
import connectDB from "@/lib/db/mongoose"
import Image from "@/lib/db/models/imageModel"
import { nanoid } from "nanoid"

/**
 * Optimizes an image and stores it in MongoDB
 * @param buffer The image buffer
 * @param filename Original filename
 * @param contentType MIME type of the image
 * @returns The URL to access the stored image
 */
export async function optimizeAndStoreImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    // Generate a unique ID for the image
    const id = nanoid()
    
    // Extract file extension
    const fileExt = filename.split(".").pop() || "jpg"
    const uniqueFilename = `${id}.${fileExt}`
    
    // Optimize the image
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .toBuffer()
    
    // Connect to database
    await connectDB()
    
    // Save image to MongoDB
    const imageDoc = await Image.create({
      filename: uniqueFilename,
      contentType,
      data: optimizedBuffer,
    })
    
    // Return the URL to access the image
    return `/api/images/${imageDoc._id}`
  } catch (error) {
    console.error("Error optimizing and storing image:", error)
    throw new Error("Failed to process image")
  }
}

/**
 * Retrieves an image from MongoDB by ID
 * @param id The image ID
 * @returns The image document or null if not found
 */
export async function getImageById(id: string) {
  try {
    await connectDB()
    return await Image.findById(id)
  } catch (error) {
    console.error("Error retrieving image:", error)
    return null
  }
}
