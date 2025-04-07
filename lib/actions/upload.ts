"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { optimizeAndStoreImage } from "@/lib/utils/image-utils"

export async function uploadImage(formData: FormData) {
  const { userId } = await auth()
  if (!userId) {
    return { error: "Unauthorized" }
  }

  try {
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      return { error: "No file provided" }
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File too large. Maximum size is 5MB." }
    }

    // Get the original file name
    let originalName = "image.jpg"
    if ('name' in file) {
      originalName = file.name
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Optimize and store the image
    const fileUrl = await optimizeAndStoreImage(buffer, originalName, file.type)

    return { success: true, url: fileUrl }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { error: "Failed to upload image" }
  }
}
