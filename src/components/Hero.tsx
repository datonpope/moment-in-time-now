import { Button } from "@/components/ui/button";
import { Clock, Camera, Smartphone, Download, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import heroImage from "@/assets/hero-authentic.jpg";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileApp, setIsMobileApp] = useState(false);

  useEffect(() => {
    setIsMobileApp(Capacitor.isNativePlatform());
  }, []);

  const handleBlueskyConnect = () => {
    navigate('/profile?tab=bluesky');
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-natural overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {isMobileApp ? (
              // Mobile App Content
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Authentic
                  <span className="bg-gradient-authentic bg-clip-text text-transparent block lg:inline"> Moments</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Capture real life in 60 seconds. Share authentic moments directly to Bluesky - no edits, no filters, no second chances.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {user ? (
                    <Button 
                      asChild 
                      variant="authentic" 
                      size="lg" 
                      className="gap-2 group hover:scale-105 transition-transform duration-200"
                    >
                      <Link to="/capture">
                        <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200" />
                        Capture Moment
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      asChild 
                      variant="authentic" 
                      size="lg" 
                      className="gap-2 group hover:scale-105 transition-transform duration-200"
                    >
                      <Link to="/auth">
                        <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200" />
                        Capture Moment
                      </Link>
                    </Button>
                  )}
                  
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg" 
                    className="gap-2 hover:scale-105 transition-transform duration-200"
                  >
                    <Link to="/">
                      <Users className="w-5 h-5" />
                      Browse Feed
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full backdrop-blur-sm border border-border/30">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    <span>No filters</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full backdrop-blur-sm border border-border/30">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span>Auto-posts</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full backdrop-blur-sm border border-border/30">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span>One chance</span>
                  </div>
                </div>
              </div>
            ) : (
              // Web Content
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm">
                  <Smartphone className="w-4 h-4 animate-pulse" />
                  Coming Soon to Mobile
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Authentic
                  <span className="bg-gradient-authentic bg-clip-text text-transparent block lg:inline"> Moments</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  The mobile app that captures real life in 60 seconds. Share authentic moments directly to Bluesky 
                  - no edits, no filters, no second chances. Get ready for the most genuine social experience.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {user ? (
                    <Button 
                      asChild 
                      variant="authentic" 
                      size="lg" 
                      className="gap-2 group hover:scale-105 transition-transform duration-200"
                    >
                      <Link to="/capture">
                        <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200" />
                        Try Web Preview
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      asChild 
                      variant="authentic" 
                      size="lg" 
                      className="gap-2 group hover:scale-105 transition-transform duration-200"
                    >
                      <Link to="/auth">
                        <Camera className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200" />
                        Try Web Preview
                      </Link>
                    </Button>
                  )}
                  
                  <Button 
                    variant="bluesky" 
                    size="lg" 
                    onClick={handleBlueskyConnect}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    Connect with Bluesky
                  </Button>
                </div>

                {/* App Store Buttons - Coming Soon */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center lg:text-left">
                    Get notified when the mobile app launches:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <div className="relative">
                      <Button 
                        disabled
                        variant="outline" 
                        size="lg" 
                        className="gap-2 opacity-60 cursor-not-allowed bg-background/50"
                      >
                        <Download className="w-5 h-5" />
                        Download on App Store
                      </Button>
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Soon
                      </span>
                    </div>
                    <div className="relative">
                      <Button 
                        disabled
                        variant="outline" 
                        size="lg" 
                        className="gap-2 opacity-60 cursor-not-allowed bg-background/50"
                      >
                        <Download className="w-5 h-5" />
                        Get it on Google Play
                      </Button>
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Soon
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full backdrop-blur-sm border border-border/30">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    <span>No filters</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full backdrop-blur-sm border border-border/30">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span>Auto-posts</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full backdrop-blur-sm border border-border/30">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span>One chance</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-authentic hover:shadow-lg transition-all duration-500 group">
              <img 
                src={heroImage} 
                alt="Authentic moment - unfiltered, natural photography"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Mobile App Preview Overlay */}
              <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6">
                <div className="bg-black/80 text-white rounded-2xl px-4 py-3 sm:px-6 flex items-center justify-between backdrop-blur-md border border-white/20 shadow-lg">
                  <span className="text-xs sm:text-sm font-medium">Mobile App Preview</span>
                  <span className="text-xl sm:text-2xl font-bold text-timer animate-pulse">00:47</span>
                </div>
              </div>

              {/* Corner indicators */}
              <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Hero;