import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Rocket,
  Network,
  UserPlus,
  TrendingUp,
  Eye,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { flowApi, flowBuilderApi, enrollmentApi } from '@/lib/api';
import { logger } from '@/lib/logger';

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function OnboardingWizard({
  open,
  onOpenChange,
}: OnboardingWizardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedTenant } = useTenantStore();
  const { user } = useAuthStore();
  const {
    currentStep,
    setCurrentStep,
    completeOnboarding,
    skipOnboarding,
    setOnboardingFlowId,
    setOnboardingEnrollmentId,
    onboardingFlowId,
    onboardingEnrollmentId,
  } = useOnboardingStore();

  const [localStep, setLocalStep] = useState(currentStep);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track what's been created
  const [createdFlowName, setCreatedFlowName] = useState<string | null>(null);
  const [createdSteps, setCreatedSteps] = useState<string[]>([]);
  const [createdStepIds, setCreatedStepIds] = useState<string[]>([]);

  // Handler: Create demo flow with steps
  const handleCreateDemoFlow = async () => {
    if (!selectedTenant) {
      setError('No tenant selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the flow
      const flowResponse = await flowApi.createFlow(selectedTenant, {
        name: 'Demo Onboarding Flow',
      });

      const flowId = flowResponse.uuid;
      setOnboardingFlowId(flowId);
      setCreatedFlowName(flowResponse.name);

      // Create 3 demo steps
      const stepNames = ['Application Submitted', 'Under Review', 'Completed'];
      const createdStepNames: string[] = [];
      const stepIds: string[] = [];

      for (const stepName of stepNames) {
        const stepResponse = await flowBuilderApi.createFlowStep(
          selectedTenant,
          flowId,
          {
            name: stepName,
          }
        );
        createdStepNames.push(stepName);
        stepIds.push(stepResponse.uuid);
      }

      setCreatedSteps(createdStepNames);
      setCreatedStepIds(stepIds);

      // Create transitions between the steps
      // Step 1 -> Step 2
      if (stepIds.length >= 2) {
        await flowBuilderApi.createFlowTransition(selectedTenant, flowId, {
          from_step: stepIds[0],
          to_step: stepIds[1],
        });
      }
      // Step 2 -> Step 3
      if (stepIds.length >= 3) {
        await flowBuilderApi.createFlowTransition(selectedTenant, flowId, {
          from_step: stepIds[1],
          to_step: stepIds[2],
        });
      }

      // Fetch the created steps to get their data for organizing
      const stepsResponse = await flowBuilderApi.getFlowSteps(
        selectedTenant,
        flowId
      );
      const steps = stepsResponse.results || [];

      // Organize the flow layout automatically
      // All steps are connected in our linear flow
      const organizeData = {
        connected_steps: steps.map(step => ({
          step_uuid: step.uuid,
          name: step.name,
          x: step.x?.toString() || '0',
          y: step.y?.toString() || '0',
        })),
        disconnected_steps: [],
        layout_info: {
          total_steps: steps.length,
          connected_count: steps.length,
          disconnected_count: 0,
        },
      };

      await flowBuilderApi.organizeFlow(
        selectedTenant,
        flowId,
        organizeData,
        true
      );

      // Invalidate queries to refresh
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      queryClient.invalidateQueries({ queryKey: ['flowSteps'] });
      queryClient.invalidateQueries({ queryKey: ['flowTransitions'] });

      logger.info(
        'Demo flow created successfully with transitions and organized layout'
      );

      // Don't auto-advance - let user click Next to see what was created
    } catch (err: any) {
      logger.error('Failed to create demo flow', err);
      setError(
        err?.response?.data?.detail ||
          'Failed to create demo flow. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Auto-enroll yourself
  const handleAutoEnroll = async () => {
    if (!selectedTenant || !onboardingFlowId) {
      setError('Missing tenant or flow information');
      return;
    }

    if (!user?.id || !user?.email) {
      setError('User information not available');
      return;
    }

    if (createdStepIds.length < 2) {
      setError('Flow steps not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create enrollment directly using the enrollment API
      const enrollmentResponse = await enrollmentApi.createEnrollment(
        selectedTenant,
        onboardingFlowId,
        user.id
      );

      // Store the enrollment ID
      const enrollmentId = enrollmentResponse.uuid;
      setOnboardingEnrollmentId(enrollmentId);

      // Move them to step 2 ("Under Review") to demonstrate progress updates
      await enrollmentApi.updateEnrollment(
        selectedTenant,
        enrollmentId,
        { current_step: createdStepIds[1] } // Move to "Under Review"
      );

      // Invalidate queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({
        queryKey: ['enrollments', selectedTenant, 'stats'],
      });
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Refresh user data including enrollments

      logger.info('Auto-enrollment successful with progress update');

      // Don't auto-advance - let user see the success message
    } catch (err: any) {
      logger.error('Failed to auto-enroll', err);
      setError(
        err?.response?.data?.detail || 'Failed to enroll. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome to Your Organization',
      description: "Let's get you set up in just a few minutes",
      icon: <Rocket className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This interactive tour will guide you through the core features of
            the platform. You'll learn how to:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create and customize flows</p>
                <p className="text-sm text-muted-foreground">
                  Build workflows to track your customers through any process
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                <UserPlus className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Invite and manage customers</p>
                <p className="text-sm text-muted-foreground">
                  Add customers to flows and track their progress
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Experience the customer view</p>
                <p className="text-sm text-muted-foreground">
                  See exactly what your customers see when tracking their status
                </p>
              </div>
            </li>
          </ul>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> We'll create a demo flow that you can
              delete later, or keep as a template. This tour takes about 3-5
              minutes to complete.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Create Your First Flow',
      description: 'Flows are workflows that track customer progress',
      icon: <Network className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          {!onboardingFlowId ? (
            <>
              <p className="text-sm text-muted-foreground">
                A <strong>flow</strong> represents any process where you want to
                track progress. Examples include:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Visa application processing
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Legal case management
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Project delivery milestones
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Service delivery tracking
                </li>
              </ul>
              <div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-4">
                <p className="mb-2 text-sm font-medium">
                  Let's create your first flow
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the button below and we'll automatically create a demo
                  flow with 3 steps for you to explore.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Flow Created Successfully!
                    </p>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                      We've created "{createdFlowName}" with{' '}
                      {createdSteps.length} steps:
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {createdSteps.map((stepName, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <span className="text-sm">{stepName}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Great! You've created your first flow. This is the foundation
                for tracking your customers' progress. Click Next to continue.
              </p>
            </>
          )}
        </div>
      ),
      action: onboardingFlowId
        ? undefined
        : {
            label: isLoading ? 'Creating...' : 'Create Demo Flow',
            onClick: handleCreateDemoFlow,
          },
    },
    {
      id: 2,
      title: 'Understanding Flow Steps',
      description: 'Steps represent stages in your customer journey',
      icon: <TrendingUp className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Each flow consists of <strong>steps</strong> that represent stages
            in your process. Customers move from one step to the next as they
            progress.
          </p>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
            <p className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
              Your Demo Flow Steps:
            </p>
            <div className="space-y-2">
              {createdSteps.map((stepName, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium dark:bg-blue-900">
                    {index + 1}
                  </div>
                  <span>{stepName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="mb-1 text-sm font-medium">
                Real-world Example: Visa Application
              </p>
              <ol className="space-y-1 text-xs text-muted-foreground">
                <li>1. Application Submitted</li>
                <li>2. Documents Under Review</li>
                <li>3. Interview Scheduled</li>
                <li>4. Decision Made</li>
                <li>5. Visa Issued</li>
              </ol>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Later:</strong> You can add more steps, edit names, or
              delete the demo flow from the Flow Builder. Click Next to
              continue.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Enroll Yourself as a Test Customer',
      description: 'Experience your flow from the customer perspective',
      icon: <UserPlus className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          {!onboardingEnrollmentId ? (
            <>
              <p className="text-sm text-muted-foreground">
                Let's enroll you in the demo flow so you can see how customers
                experience it. We'll automatically add you as a customer and
                show you what progress notifications look like.
              </p>
              <div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-4">
                <p className="mb-2 text-sm font-medium">
                  What happens when you click "Enroll Me":
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    <span>
                      You'll be enrolled in the "Demo Onboarding Flow"
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    <span>
                      We'll automatically move you to "Under Review" to
                      demonstrate progress updates
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    <span>
                      You'll receive a notification about your step being
                      updated
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">4.</span>
                    <span>
                      The notification includes a helpful link to view your
                      personal status page
                    </span>
                  </li>
                </ol>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> We'll enroll you using your account
                  email ({user?.email}).
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      You're Enrolled and Moving Forward!
                    </p>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                      You've been enrolled as <strong>{user?.email}</strong> and
                      automatically moved to step 2
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg border bg-card p-3">
                  <p className="mb-2 text-sm font-medium">Your Progress:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground line-through">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>1. Application Submitted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      <span>2. Under Review (Current)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full border-2 border-muted-foreground/30" />
                      <span>3. Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <p className="mb-2 text-sm">
                  <strong>Notification Sent!</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a notification about moving to "Under Review",
                  with a helpful link to your personal status page. This is what
                  your customers experience when their status changes!
                </p>
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  <strong>Note:</strong> Email and WhatsApp notifications are
                  only available on paid plans. Free plan users can still track
                  status updates via the customer portal.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Perfect! You've experienced enrollment and a progress update.
                Click Next to continue.
              </p>
            </>
          )}
        </div>
      ),
      action: onboardingEnrollmentId
        ? undefined
        : {
            label: isLoading ? 'Enrolling...' : 'Enroll Me',
            onClick: handleAutoEnroll,
          },
    },
    {
      id: 4,
      title: 'Managing Customer Progress',
      description: 'Learn how to move customers through your flow',
      icon: <TrendingUp className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            As your customers make progress, you'll update their status by
            moving them to the next step in the flow.
          </p>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
            <p className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
              Your enrollment is ready!
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You've been enrolled in the demo flow. Now you can manage your
              progress through the 3 steps we created.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="mb-2 text-sm font-medium">
                Where to update progress:
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <strong>Customer Management</strong> - View all enrollments
                  and update their status
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <strong>Enrollment Details</strong> - Click on a customer to
                  see their full history and update progress
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Try it later:</strong> After completing this tour, go to{' '}
              <strong>Customer Management</strong> to practice moving your test
              enrollment through the flow steps. Click Next to continue.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'View the Customer Experience',
      description: 'See what your customers see when tracking their status',
      icon: <Eye className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your customers receive a personalized tracking page where they can
            see their current status and progress through your flow.
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="mb-2 text-sm font-medium">
                The customer view includes:
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Current step and status
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Visual progress indicator
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Timeline of their journey
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Branded with your organization name
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              Check the customer management page to see it in action under your
              organisations.
            </p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Pro tip:</strong> You can customize the look and feel of
              the customer tracking page from organization settings.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "You're All Set!",
      description: "You've completed the onboarding tour",
      icon: <Check className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-1 font-medium">Congratulations!</p>
            <p className="text-sm text-muted-foreground">
              You've learned the basics of managing customer flows
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">What's next?</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Create real flows for your business processes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Invite real customers to your flows</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Invite team members to collaborate</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Customize your organization branding</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              Need help? Check out the Getting Started guide in the Help section
              (accessible from the navigation menu).
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[localStep];
  const progress = ((localStep + 1) / steps.length) * 100;
  const isFirstStep = localStep === 0;
  const isLastStep = localStep === steps.length - 1;

  const handleNext = () => {
    setError(null);
    if (isLastStep) {
      completeOnboarding();
      onOpenChange(false);
    } else {
      const nextStep = localStep + 1;
      setLocalStep(nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    setError(null);
    if (!isFirstStep) {
      const prevStep = localStep - 1;
      setLocalStep(prevStep);
      setCurrentStep(prevStep);
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    onOpenChange(false);
  };

  const handleClose = () => {
    // Save current progress
    setCurrentStep(localStep);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-2xl rounded-lg border border-border bg-background shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="pt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {localStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-6">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
            disabled={isLoading}
          >
            Skip tour
          </Button>
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
            )}
            {currentStepData.action ? (
              <Button
                onClick={currentStepData.action.onClick}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentStepData.action.label}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={isLoading}>
                {isLastStep ? 'Complete Tour' : 'Next'}
                {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
