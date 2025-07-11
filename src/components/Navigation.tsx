import { Button } from "@/components/ui/button";
import { Camera, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors duration-200 group"
        >
          <Camera className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
          <span className="hidden sm:inline">Authentic Moments</span>
          <span className="sm:hidden">Authentic</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            asChild
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>

          <Button
            asChild
            variant={location.pathname === '/' ? 'ghost' : 'ghost'}
            size="sm"
            className="sm:hidden"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant={location.pathname === '/capture' ? 'authentic' : 'outline'}
            size="sm"
            className="relative overflow-hidden group"
          >
            <Link to="/capture">
              <Camera className="w-4 h-4 sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Capture</span>
              {location.pathname === '/capture' && (
                <div className="absolute inset-0 bg-gradient-authentic opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-colors duration-200">
                <Avatar className="w-6 h-6 ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs bg-gradient-authentic text-white">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-md border border-border/50">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile" className="flex items-center w-full">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => signOut()} 
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;