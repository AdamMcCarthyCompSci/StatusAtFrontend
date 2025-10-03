import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';

// Import the modernized components
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
import Header from './Header';

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
      {/* Show header only for authenticated users */}
      {isAuthenticated && <Header />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomeShell />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/email-confirmation/:token" element={<EmailConfirmation />} />

                {/* Protected routes */}
                {isAuthenticated && (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/flows" element={<FlowManagement />} />
                    <Route path="/flows/:flowId/edit" element={<FlowBuilder />} />
                    <Route path="/status-tracking/:enrollmentId" element={<StatusTrackingPage />} />
                    <Route path="/members" element={<MemberManagement />} />
                    <Route path="/customers" element={<CustomerManagement />} />
                    <Route path="/customers/:enrollmentId/history" element={<EnrollmentHistoryPage />} />
                    <Route path="/account" element={<AccountSettings />} />
                  </>
                )}

        {/* Temporary minimal pages for unmigrated components */}
        <Route path="/premium" element={<MinimalPage title="Premium" />} />
        <Route path="/privacy" element={<MinimalPage title="Privacy Policy" />} />
        <Route path="/terms" element={<MinimalPage title="Terms of Service" />} />
        <Route path="/unsubscribe/:token" element={<MinimalPage title="Unsubscribe" />} />
        
        {/* 404 page */}
        <Route path="*" element={<MinimalPage title="Page Not Found" />} />
      </Routes>
    </div>
  );
};

export default Shell;
