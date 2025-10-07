import { Link as RouterLink } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              StatusAt
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The most powerful status tracking platform for modern teams. 
              Streamline workflows and boost productivity.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/features">Features</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/pricing">Pricing</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/integrations">Integrations</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/api">API</RouterLink>
                </Button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/about">About</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/blog">Blog</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/careers">Careers</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/contact">Contact</RouterLink>
                </Button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/help">Help Center</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/docs">Documentation</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/status">Status</RouterLink>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/security">Security</RouterLink>
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} StatusAt. All rights reserved.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/privacy">Privacy Policy</RouterLink>
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/terms">Terms of Service</RouterLink>
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground" asChild>
                  <RouterLink to="/cookies">Cookie Policy</RouterLink>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by the StatusAt team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
