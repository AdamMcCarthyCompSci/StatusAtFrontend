import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import AuthenticatedRedirect from './AuthenticatedRedirect';
import HomeShell from '../Home/HomeShell';

const RootRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useCurrentUser();

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect them to appropriate page
  if (isAuthenticated) {
    return <AuthenticatedRedirect />;
  }

  // If user is not authenticated, show the landing page
  return <HomeShell />;
};

export default RootRedirect;
