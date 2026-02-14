import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCurrentUser, useLogout } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';

export const AuthDemo = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { isAuthenticated, tokens } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          Current authentication state and user information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ <strong>Authenticated</strong>
              </p>
            </div>

            {userLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading user data...
              </p>
            ) : user ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm">
                  <strong>User ID:</strong> {user.id}
                </p>
                <p className="text-sm">
                  <strong>Theme:</strong> {user.color_scheme}
                </p>
                <p className="text-sm">
                  <strong>Admin:</strong>{' '}
                  {user.memberships?.length > 0 ? 'Yes' : 'No'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No user data available
              </p>
            )}

            <div className="border-t pt-2">
              <p className="mb-2 text-xs text-muted-foreground">
                Access Token: {tokens?.access ? '✅ Present' : '❌ Missing'}
              </p>
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full"
                variant="outline"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                ❌ <strong>Not Authenticated</strong>
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              You need to sign in to see user data and access protected
              features.
            </p>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/sign-up">Create Account</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
