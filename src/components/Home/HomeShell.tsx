import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, BarChart3, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCurrentUser } from "@/hooks/useUserQuery";
import Footer from "../layout/Footer";

const HomeShell = () => {
  const { isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        {/* Header with theme toggle */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">StatusAt</h1>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            {/* Hero Section */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Track Status,
                <br />
                <span className="text-primary">Deliver Results</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your workflow with powerful status tracking. 
                Manage flows, track progress, and keep everyone informed.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 py-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Flow Management</h3>
                <p className="text-muted-foreground">
                  Create and manage custom status flows for your processes
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Manage team members and customer access with role-based permissions
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Easy Setup</h3>
                <p className="text-muted-foreground">
                  Get started quickly with intuitive tools and modern interface
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-muted rounded-lg w-48 mx-auto"></div>
                </div>
              ) : isAuthenticated && user ? (
                <div className="space-y-4">
                  <p className="text-lg">
                    Welcome back, <span className="font-semibold">{user.name || user.email}</span>!
                  </p>
                  <Button asChild size="lg" className="text-lg px-8 py-6">
                    <RouterLink to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </RouterLink>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                      <RouterLink to="/sign-in">
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </RouterLink>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                      <RouterLink to="/sign-up">
                        Create Account
                      </RouterLink>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Links */}
            <div className="flex justify-center gap-4 pt-8">
              <Button variant="ghost" size="sm" asChild>
                <RouterLink to="/privacy">
                  Privacy Policy
                </RouterLink>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <RouterLink to="/terms">
                  Terms
                </RouterLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomeShell;
