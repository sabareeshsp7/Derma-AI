import type React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

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
      const tokenPayload = accessToken.split('.')[1];
      const normalizedPayload = tokenPayload.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(normalizedPayload, 'base64').toString());
      const userId = payload.sub;
      const email = payload.email;

      user = {
        id: userId,
        email: email || '',
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
