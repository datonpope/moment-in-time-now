import { Button } from "@/components/ui/button";
import { Clock, Camera } from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-authentic.jpg";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-natural">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Camera className="w-6 h-6" />
            Authentic Moments
          </div>
          <UserNav />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                60 seconds to authenticity
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Authentic
                <span className="bg-gradient-authentic bg-clip-text text-transparent"> Moments</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                The only place you can't fake it. 60 seconds from capture to share on Bluesky. 
                No edits, no filters, no retakes - just pure, unfiltered moments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <Button variant="authentic" size="lg" className="gap-2">
                  <Camera className="w-5 h-5" />
                  Capture Your Moment
                </Button>
              ) : (
                <Button variant="authentic" size="lg" className="gap-2">
                  <Camera className="w-5 h-5" />
                  Start Your First Moment
                </Button>
              )}
              
              <Button variant="bluesky" size="lg">
                Connect with Bluesky
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                No filters allowed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Auto-posts to Bluesky
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Authenticity verified
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-authentic">
              <img 
                src={heroImage} 
                alt="Authentic moment - unfiltered, natural photography"
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay timer mockup */}
              <div className="absolute top-6 left-6 right-6">
                <div className="bg-black/70 text-white rounded-full px-6 py-3 flex items-center justify-between backdrop-blur-md">
                  <span className="text-sm font-medium">Capture your moment</span>
                  <span className="text-2xl font-bold text-timer">00:47</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;