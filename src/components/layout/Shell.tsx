import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';

// Import the modernized components
import RootRedirect from '../Authentication/RootRedirect';
import HomeShell from '../Home/HomeShell';
import SignIn from '../Authentication/SignIn';
import SignUp from '../Authentication/SignUp';
import ForgotPassword from '../Authentication/ForgotPassword';
import EmailConfirmation from '../Authentication/EmailConfirmation';
import ConfirmEmail from '../Authentication/ConfirmEmail';
import Dashboard from '../Dashboard/Dashboard';
import FlowManagement from '../Flow/FlowManagement';
import FlowBuilder from '../Flow/FlowBuilder';
import StatusTrackingPage from '../Flow/StatusTrackingPage';
import MemberManagement from '../Member/MemberManagement';
import CustomerManagement from '../Customer/CustomerManagement';
import EnrollmentHistoryPage from '../Customer/EnrollmentHistoryPage';
import AccountSettings from '../Account/AccountSettings';
import InboxPage from '../Inbox/InboxPage';
import FlowInviteLanding from '../Flow/FlowInviteLanding';
import TenantPage from '../Tenant/TenantPage';
import OrganizationSettings from '../Tenant/OrganizationSettings';
import CreateOrganization from '../Tenant/CreateOrganization';
import PaymentSuccess from '../Payment/PaymentSuccess';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfService from '../TermsOfService';
import Header from './Header';
import NotFoundPage from './NotFoundPage';
import { TenantGuard } from './TenantGuard';

// Temporary minimal components for pages that haven't been migrated yet
const MinimalPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-background text-foreground p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">
        This page is being migrated to the new modern setup. 
        The old Mantine components have been removed.
      </p>
    </div>
  </div>
);

const Shell = () => {
  const { isLoading } = useCurrentUser();
  const { theme } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {isAuthenticated && <Header />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={<HomeShell />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/email-confirmation/:token" element={<EmailConfirmation />} />
        <Route path="/invite/:tenantName/:flowName" element={<FlowInviteLanding />} />
        
        {/* Legal and policy pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* Temporary minimal pages for unmigrated components */}
        <Route path="/premium" element={<MinimalPage title="Premium" />} />
        <Route path="/unsubscribe/:token" element={<MinimalPage title="Unsubscribe" />} />

        {/* Status tracking route */}
        <Route path="/status-tracking/:tenantUuid/:enrollmentId" element={<StatusTrackingPage />} />
        
        {/* Payment success route */}
        <Route path="/payment/success" element={<PaymentSuccess />} />

        {/* Protected routes */}
        {isAuthenticated && (
          <>
            {/* Dashboard and Account - always accessible */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/create-organization" element={<CreateOrganization />} />

            {/* Restricted routes - blocked for CREATED/CANCELLED tenants */}
            <Route path="/flows" element={<TenantGuard><FlowManagement /></TenantGuard>} />
            <Route path="/flows/:flowId/edit" element={<TenantGuard><FlowBuilder /></TenantGuard>} />
            <Route path="/members" element={<TenantGuard><MemberManagement /></TenantGuard>} />
            <Route path="/customer-management" element={<TenantGuard><CustomerManagement /></TenantGuard>} />
            <Route path="/customers/:enrollmentId" element={<EnrollmentHistoryPage />} />
            <Route path="/inbox" element={<TenantGuard><InboxPage /></TenantGuard>} />
            <Route path="/organization-settings" element={<TenantGuard><OrganizationSettings /></TenantGuard>} />
          </>
        )}

        {/* Tenant page - must come after specific routes */}
        <Route path="/:tenantName" element={<TenantPage />} />
        
        {/* 404 page - must come last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default Shell;
