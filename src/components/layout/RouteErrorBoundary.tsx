import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallbackRoute?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    logger.error('RouteErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an error while loading this page. Don't worry,
                your data is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error details (development only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="rounded-lg bg-muted p-4">
                  <summary className="mb-2 cursor-pointer text-sm font-medium">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">
                        Error Message:
                      </p>
                      <pre className="overflow-auto rounded bg-background p-2 text-xs">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">
                          Stack Trace:
                        </p>
                        <pre className="max-h-40 overflow-auto rounded bg-background p-2 text-xs">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to={this.props.fallbackRoute || '/dashboard'}>
                    <Home className="mr-2 h-4 w-4" />
                    Go to{' '}
                    {this.props.fallbackRoute ? 'Previous Page' : 'Dashboard'}
                  </Link>
                </Button>
              </div>

              {/* Help text */}
              <p className="text-center text-sm text-muted-foreground">
                If the problem persists, please contact support or try
                refreshing the page.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
