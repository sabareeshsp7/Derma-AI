import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    // Correctly access cookies in a Route Handler
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")?.value

    const formData = await request.formData()

    // Forward the request to the FastAPI backend
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        // Include auth token if available
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.detail || "Failed to process image" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in predict API route:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { 
            error: "AI service is not available. Please ensure the FastAPI backend is running on port 8000.",
            details: "Run: cd api && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"
          }, 
          { status: 503 }
        )
      }
      if (error.message.includes("fetch failed")) {
        return NextResponse.json(
          { 
            error: "Failed to connect to AI service",
            details: error.message 
          }, 
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}
