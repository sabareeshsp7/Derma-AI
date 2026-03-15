import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await signIn(email, password);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: result.user?.id,
          email: result.user?.email,
          full_name: result.user?.user_metadata?.full_name,
        },
        session: result.session,
      },
      { status: 200 }
    );

    // Set secure cookies
    if (result.accessToken) {
      response.cookies.set('sb-access-token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: result.expiresIn
      });
    }

    if (result.refreshToken) {
      response.cookies.set('sb-refresh-token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid credentials" },
      { status: 401 }
    );

    // Ensure stale auth cookies do not keep user in an invalid authenticated state.
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('accessToken');

    return response;
  }
}

