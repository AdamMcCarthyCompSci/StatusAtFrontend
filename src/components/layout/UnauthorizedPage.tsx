import { Link, useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';

const UnauthorizedPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-2xl">
        {/* Animated 403 */}
        <div className="mb-8 text-center">
          <div className="relative">
            <h1 className="select-none text-9xl font-bold text-destructive/20">
              403
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldX className="h-16 w-16 animate-pulse text-destructive" />
            </div>
          </div>
          <h2 className="mb-2 mt-4 text-3xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            You don't have permission to view this page. Contact your
            organization owner for access.
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="border-2 border-dashed border-muted-foreground/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6 text-center">
              {/* Illustration */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10">
                    <Lock className="h-12 w-12 text-destructive/60" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
                    <span className="text-xs font-bold text-destructive-foreground">
                      !
                    </span>
                  </div>
                </div>
              </div>

              {/* Helpful Message */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Why can't I access this?
                </h3>
                <p className="text-muted-foreground">
                  This page requires elevated permissions. Only users with STAFF
                  or OWNER roles can access this area.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
                <Button
                  onClick={() => navigate(-1)}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>

                {isAuthenticated ? (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Link to="/dashboard">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Link to="/sign-in">
                      <ArrowLeft className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>

              {/* Additional Help */}
              <div className="border-t border-border/50 pt-6">
                <p className="text-sm text-muted-foreground">
                  Need elevated access? Contact your organization owner or{' '}
                  <Link
                    to="/dashboard"
                    className="text-primary hover:underline"
                  >
                    return to dashboard
                  </Link>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-ping rounded-full bg-destructive/30"></div>
          <div className="absolute right-1/3 top-1/3 h-1 w-1 animate-pulse rounded-full bg-destructive/40"></div>
          <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1.5 animate-bounce rounded-full bg-destructive/30"></div>
          <div className="absolute bottom-1/3 right-1/4 h-1 w-1 animate-ping rounded-full bg-destructive/20"></div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
