import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router-dom";
import { CheckSquare, Menu } from "lucide-react";
import { Margin } from "@mui/icons-material";

const Navbar = () => {
 return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Far Left */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">TaskSaaS</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              Beta
            </Badge>
          </div>
          
          {/* Desktop Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
          </div>
          
          {/* Auth Buttons - Far Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Start Free</Link>
              </Button>
            </div>
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;