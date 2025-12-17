import { ReactNode, useEffect } from 'react';
import { useAuth } from './auth-context';
import { LoadingScreen } from './loading-screen';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if authentication is required but user is not logged in
    if (!loading && requireAuth && !user) {
      window.location.href = redirectTo;
    }
    
    // Redirect if user is logged in but shouldn't be (e.g., on login page)
    if (!loading && !requireAuth && user) {
      window.location.href = '/dashboard';
    }
  }, [user, loading, requireAuth, redirectTo]);

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Show nothing while redirecting
  if (requireAuth && !user) {
    return <LoadingScreen />;
  }

  if (!requireAuth && user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
