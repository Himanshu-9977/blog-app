import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/mongoose"
import Image from "@/lib/db/models/imageModel"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return new NextResponse("Image ID is required", { status: 400 })
    }
    
    await connectDB()
    
    const image = await Image.findById(id)
    
    if (!image) {
      return new NextResponse("Image not found", { status: 404 })
    }
    
    // Set appropriate cache headers
    const headers = new Headers()
    headers.set("Content-Type", image.contentType)
    headers.set("Cache-Control", "public, max-age=31536000, immutable") // Cache for 1 year
    
    return new NextResponse(image.data, { 
      status: 200,
      headers
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
