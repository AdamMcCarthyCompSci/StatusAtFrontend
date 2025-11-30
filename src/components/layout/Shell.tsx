import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useAppStore } from '@/stores/useAppStore';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { ApiError } from '@/types/api';

import Header from './Header';
import { TenantGuard } from './TenantGuard';
import { RoleGuard } from './RoleGuard';
import { RouteErrorBoundary } from './RouteErrorBoundary';

// Eager-load critical components (needed immediately)
import RootRedirect from '../Authentication/RootRedirect';
import SignIn from '../Authentication/SignIn';

// Lazy-load route components (loaded on demand)
const HomeShell = lazy(() => import('../Home/HomeShell'));
const SignUp = lazy(() => import('../Authentication/SignUp'));
const ForgotPassword = lazy(() => import('../Authentication/ForgotPassword'));
const EmailConfirmation = lazy(
  () => import('../Authentication/EmailConfirmation')
);
const ConfirmEmail = lazy(() => import('../Authentication/ConfirmEmail'));
const Dashboard = lazy(() => import('../Dashboard/Dashboard'));
const FlowManagement = lazy(() => import('../Flow/FlowManagement'));
const FlowBuilder = lazy(() => import('../Flow/FlowBuilder'));
const StatusTrackingPage = lazy(() => import('../Flow/StatusTrackingPage'));
const MemberManagement = lazy(() => import('../Member/MemberManagement'));
const CustomerManagement = lazy(() => import('../Customer/CustomerManagement'));
const EnrollmentHistoryPage = lazy(
  () => import('../Customer/EnrollmentHistoryPage')
);
const AccountSettings = lazy(() => import('../Account/AccountSettings'));
const InboxPage = lazy(() => import('../Inbox/InboxPage'));
const FlowInviteLanding = lazy(() => import('../Flow/FlowInviteLanding'));
const TenantPage = lazy(() => import('../Tenant/TenantPage'));
const OrganizationSettings = lazy(
  () => import('../Tenant/OrganizationSettings')
);
const CreateOrganization = lazy(() => import('../Tenant/CreateOrganization'));
const PaymentSuccess = lazy(() => import('../Payment/PaymentSuccess'));
const PrivacyPolicy = lazy(() => import('../PrivacyPolicy'));
const TermsOfService = lazy(() => import('../TermsOfService'));
const Unsubscribe = lazy(() => import('../Unsubscribe/Unsubscribe'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./UnauthorizedPage'));

// Temporary minimal components for pages that haven't been migrated yet
const MinimalPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-background p-8 text-foreground">
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">
        This page is being migrated to the new modern setup. The old Mantine
        components have been removed.
      </p>
    </div>
  </div>
);

// Helper component to wrap routes with error boundaries
const ProtectedRoute = ({
  children,
  fallbackRoute,
}: {
  children: React.ReactNode;
  fallbackRoute?: string;
}) => (
  <RouteErrorBoundary fallbackRoute={fallbackRoute}>
    {children}
  </RouteErrorBoundary>
);

const Shell = () => {
  const { isLoading } = useCurrentUser();
  const { theme } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handle API errors that require navigation (e.g., user_not_found)
  useEffect(() => {
    const handleGlobalError = (error: unknown) => {
      if (error instanceof ApiError && error.data?.shouldRedirectHome) {
        // Clear all queries to reset app state
        queryClient.clear();

        // Navigate to sign in page
        navigate('/sign-in', {
          replace: true,
          state: { message: error.message },
        });
      }
    };

    // Listen for React Query errors
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (event.type === 'updated' && event.action.type === 'error') {
        handleGlobalError(event.action.error);
      }
    });

    return () => unsubscribe();
  }, [navigate, queryClient]);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background text-foreground"
        role="status"
        aria-live="polite"
        aria-label="Loading application"
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"
            role="img"
            aria-label="Loading spinner"
          ></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {isAuthenticated && <Header />}

      <Suspense
        fallback={
          <div
            className="flex min-h-screen items-center justify-center bg-background text-foreground"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
          >
            <div className="text-center">
              <div
                className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"
                role="img"
                aria-label="Loading spinner"
              ></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Public routes - wrapped with error boundaries */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute fallbackRoute="/">
                <HomeShell />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <ProtectedRoute fallbackRoute="/sign-in">
                <SignUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute fallbackRoute="/sign-in">
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirm-email"
            element={
              <ProtectedRoute fallbackRoute="/sign-in">
                <ConfirmEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-confirmation/:token"
            element={
              <ProtectedRoute fallbackRoute="/sign-in">
                <EmailConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite/:tenantName/:flowName"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <FlowInviteLanding />
              </ProtectedRoute>
            }
          />

          {/* Legal and policy pages */}
          <Route
            path="/privacy"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <PrivacyPolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <TermsOfService />
              </ProtectedRoute>
            }
          />

          {/* Unsubscribe page */}
          <Route
            path="/unsubscribe"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <Unsubscribe />
              </ProtectedRoute>
            }
          />

          {/* Temporary minimal pages for unmigrated components */}
          <Route path="/premium" element={<MinimalPage title="Premium" />} />

          {/* Status tracking route */}
          <Route
            path="/status-tracking/:tenantUuid/:enrollmentId"
            element={
              <ProtectedRoute fallbackRoute="/dashboard">
                <StatusTrackingPage />
              </ProtectedRoute>
            }
          />

          {/* Payment success route */}
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute fallbackRoute="/dashboard">
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - wrapped with error boundaries */}
          {isAuthenticated && (
            <>
              {/* Dashboard and Account - always accessible */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute fallbackRoute="/home">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <AccountSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-organization"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <CreateOrganization />
                  </ProtectedRoute>
                }
              />

              {/* Restricted routes - blocked for CREATED/CANCELLED tenants + role-based */}
              <Route
                path="/flows"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <TenantGuard>
                      <RoleGuard minimumRole="STAFF">
                        <FlowManagement />
                      </RoleGuard>
                    </TenantGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flows/:flowId/edit"
                element={
                  <ProtectedRoute fallbackRoute="/flows">
                    <TenantGuard>
                      <RoleGuard minimumRole="STAFF">
                        <FlowBuilder />
                      </RoleGuard>
                    </TenantGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <TenantGuard>
                      <MemberManagement />
                    </TenantGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-management"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <TenantGuard>
                      <CustomerManagement />
                    </TenantGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/:enrollmentId"
                element={
                  <ProtectedRoute fallbackRoute="/customer-management">
                    <EnrollmentHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inbox"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <TenantGuard>
                      <InboxPage />
                    </TenantGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization-settings"
                element={
                  <ProtectedRoute fallbackRoute="/dashboard">
                    <TenantGuard>
                      <RoleGuard minimumRole="STAFF">
                        <OrganizationSettings />
                      </RoleGuard>
                    </TenantGuard>
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Tenant page - must come after specific routes */}
          <Route
            path="/:tenantName"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <TenantPage />
              </ProtectedRoute>
            }
          />

          {/* 403 Unauthorized page */}
          <Route
            path="/unauthorized"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <UnauthorizedPage />
              </ProtectedRoute>
            }
          />

          {/* 404 page - must come last */}
          <Route
            path="*"
            element={
              <ProtectedRoute fallbackRoute="/home">
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Shell;
