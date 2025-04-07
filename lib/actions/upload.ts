"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import path from "path"
import fs from "fs"
// Generate a random ID for filenames
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

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

    // Get the original file name to extract extension
    let originalName = "image"
    if ('name' in file) {
      originalName = file.name
    }

    // Generate unique filename
    const fileExt = originalName.split(".").pop() || "jpg"
    const fileName = `${generateId()}.${fileExt}`
    const filePath = path.join(uploadDir, fileName)

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${fileName}`

    return { success: true, url: fileUrl }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { error: "Failed to upload image" }
  }
}
