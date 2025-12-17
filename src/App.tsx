import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/auth-context';
import { AppProvider } from './components/app-context';
import { ThemeProvider } from './components/theme-context';
import { LinksProvider } from './components/links-context';
import { LinkBioProvider } from './components/link-bio-context';
import { AnalyticsProvider } from './components/analytics-context';
import { MainDashboard } from './components/main-dashboard';
import { PublicProfile } from './components/public/public-profile';
import { LoadingScreen } from './components/loading-screen';
import { AuthFlow } from './components/auth/auth-flow';
import { ForgotPasswordPage } from './components/auth/forgot-password-page';
import { AcceptInvitePage } from './components/auth/accept-invite-page';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/error-boundary';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  
  // Simple routing based on URL
  const path = window.location.pathname;
  const isPublicPage = path.startsWith('/u/');
  const username = isPublicPage ? path.slice(3) : null;

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    if (hasSeenLoader) {
      setShowInitialLoader(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoader', 'true');
    setShowInitialLoader(false);
  };

  // 1. Initial Loader (Feature - only on home page)
  if (showInitialLoader && path === '/') {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // 2. Auth Loading (Critical - blocks everything else)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006EF7]"></div>
      </div>
    );
  }

  // 3. Routing Logic
  
  // Auth routes (public)
  if (path === '/signup') return <><AuthFlow initialView="signup" /><Toaster /></>;
  if (path === '/login') return <><AuthFlow initialView="login" /><Toaster /></>;
  if (path === '/forgot-password') return <><ForgotPasswordPage /><Toaster /></>;

  // Public Profile
  if (isPublicPage && username) return <><PublicProfile username={username} /><Toaster /></>;

  // Invite Accept Route
  if (path === '/invite/accept') return <><AcceptInvitePage /><Toaster /></>;

  // Welcome page (if not authenticated and on root)
  if (!user && path === '/') return <><AuthFlow initialView="welcome" /><Toaster /></>;

  // Redirect Logic
  if (user && path === '/') {
    // Authenticated user on root -> Dashboard
    // Use replaceState to update URL without reload
    window.history.replaceState(null, '', '/dashboard');
    return <><MainDashboard /><Toaster /></>;
  }

  // Protected routes
  if (user) {
    return <><MainDashboard /><Toaster /></>;
  }

  // If not user and trying to access protected route (anything else)
  // Redirect to login
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppProvider>
            <LinksProvider>
              <LinkBioProvider>
                <AnalyticsProvider>
                  <AppRoutes />
                </AnalyticsProvider>
              </LinkBioProvider>
            </LinksProvider>
          </AppProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
