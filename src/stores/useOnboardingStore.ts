import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  // State
  hasCompletedOnboarding: boolean;
  hasSkippedOnboarding: boolean;
  currentStep: number;
  onboardingFlowId: string | null;
  onboardingEnrollmentId: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  setOnboardingFlowId: (flowId: string | null) => void;
  setOnboardingEnrollmentId: (enrollmentId: string | null) => void;
}

const initialState = {
  hasCompletedOnboarding: false,
  hasSkippedOnboarding: false,
  currentStep: 0,
  onboardingFlowId: null,
  onboardingEnrollmentId: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    set => ({
      ...initialState,

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      completeOnboarding: () => {
        set({
          hasCompletedOnboarding: true,
          hasSkippedOnboarding: false,
          currentStep: 0,
          onboardingFlowId: null,
          onboardingEnrollmentId: null,
        });
      },

      skipOnboarding: () => {
        set({
          hasSkippedOnboarding: true,
          currentStep: 0,
        });
      },

      resetOnboarding: () => {
        set(initialState);
      },

      setOnboardingFlowId: (flowId: string | null) => {
        set({ onboardingFlowId: flowId });
      },

      setOnboardingEnrollmentId: (enrollmentId: string | null) => {
        set({ onboardingEnrollmentId: enrollmentId });
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
