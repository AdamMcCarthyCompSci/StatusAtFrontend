import { Rocket, X } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

interface OnboardingCardProps {
  onStart: () => void;
}

export function OnboardingCard({ onStart }: OnboardingCardProps) {
  const { skipOnboarding } = useOnboardingStore();

  const handleSkip = () => {
    skipOnboarding();
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Welcome to Your Organization!</CardTitle>
              <CardDescription className="mt-1">
                Let's get you started with a quick interactive tour
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Skip onboarding</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            We'll walk you through:
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Creating your first flow
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Adding steps to track progress
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Inviting and managing customers
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Viewing progress from your customer's perspective
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={onStart} size="lg" className="flex-1">
            <Rocket className="mr-2 h-4 w-4" />
            Start Interactive Tour
          </Button>
          <Button onClick={handleSkip} variant="outline" size="lg">
            I'll explore on my own
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Takes about 3-5 minutes • You can restart this tour anytime from
          account settings
        </p>
      </CardContent>
    </Card>
  );
}
