import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated 404 */}
        <div className="text-center mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary/20 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like this page got lost in the flow. Don't worry, we'll help you get back on track.
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="border-2 border-dashed border-muted-foreground/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Illustration */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Search className="h-12 w-12 text-primary/60" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive-foreground">!</span>
                  </div>
                </div>
              </div>

              {/* Helpful Message */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  What happened?
                </h3>
                <p className="text-muted-foreground">
                  The page you're looking for might have been moved, deleted, or doesn't exist yet.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link to="/home">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                
                {isAuthenticated ? (
                  <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                    <Link to="/dashboard">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                    <Link to="/sign-in">
                      <ArrowLeft className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>

              {/* Additional Help */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Need help? Check out our{' '}
                  <Link to="/home" className="text-primary hover:underline">
                    main page
                  </Link>{' '}
                  or contact support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-primary/20 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
