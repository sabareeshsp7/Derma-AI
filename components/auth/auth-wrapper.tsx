"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getUserSession } from '@/lib/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthWrapper({ 
  children, 
  redirectTo = '/auth/login', 
  requireAuth = true 
}: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getUserSession();
        
        setIsAuthenticated(!!session);
        
        if (requireAuth && !session) {
          router.push(redirectTo);
        }
      } catch (error) {
        setError('Authentication check failed');
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        if (requireAuth) {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-gray-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Authentication Required</h3>
            <p className="text-red-600 mb-4">
              {error || 'Please sign in to access this page'}
            </p>
            <Button 
              onClick={() => router.push(redirectTo)}
              className="bg-red-600 hover:bg-red-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}