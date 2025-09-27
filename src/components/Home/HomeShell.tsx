import { Link as RouterLink } from "react-router-dom";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useUrlSearch } from "@/hooks/useUrlState";
import { AuthDemo } from "./AuthDemo";
import Footer from "../layout/Footer";

const HomeShell = () => {
  // Using our custom URL state hook (React Router based)
  const [search, setSearch] = useUrlSearch();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        {/* Header with theme toggle */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Modern Frontend Skeleton</h1>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Modern Auth Demo */}
            <AuthDemo />
            
            {/* URL State Demo */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">URL State Demo (Custom Hook)</h2>
              <div className="max-w-md mx-auto">
                <Input
                  placeholder="Type to update URL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {search ? `URL param: ?search=${search}` : 'Start typing to see URL state in action!'}
                </p>
              </div>
            </div>
            
            {/* Instagram Button */}
            <Button
              onClick={() =>
                window.open(
                  "https://instagram.com/statusat",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="w-full h-12 text-base"
              variant="outline"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow us on Instagram!
            </Button>

            {/* Footer Links */}
            <div className="flex justify-center gap-4">
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
