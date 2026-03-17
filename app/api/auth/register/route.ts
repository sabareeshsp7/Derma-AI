import { NextResponse } from "next/server";
import { isAuthConfigurationError, signUp } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Create user in Supabase
    const result = await signUp(email, password, name);

    return NextResponse.json(
      {
        message: "Registration successful! You can now log in.",
        user: {
          id: result.user?.id,
          email: result.user?.email,
          full_name: result.user?.user_metadata?.full_name,
        }
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);

    return NextResponse.json(
      {
        error: isAuthConfigurationError(error)
          ? "Authentication service is not configured on the server. Check the Vercel environment variables for Supabase."
          : error instanceof Error
            ? error.message
            : "Registration failed",
      },
      { status: 500 }
    );
  }
}
