import type React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { decodeJwtPayload } from "@/lib/jwt";

type CustomUser = {
  id: string;
  email: string;
  user_metadata: {
    avatar_url: string;
    [key: string]: unknown;
  };
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get('sb-access-token')?.value ||
    cookieStore.get('accessToken')?.value;

  let user: CustomUser | null = null;

  if (accessToken) {
    try {
      const payload = decodeJwtPayload(accessToken);
      if (!payload || typeof payload.sub !== 'string' || payload.sub.length === 0) {
        throw new Error('Invalid access token');
      }

      const userId = payload.sub;
      const email = typeof payload.email === 'string' ? payload.email : '';

      user = {
        id: userId,
        email,
        user_metadata: {
          avatar_url: '',
        },
      };
    } catch (error) {
      console.error('Failed to get user:', error);
    }
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader user={user} />
        <main className="container py-6">{children}</main>
      </div>
    </div>
  );
}
