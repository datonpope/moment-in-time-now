
import Hero from "@/components/Hero";
import MomentsFeed from "@/components/MomentsFeed";
import BlueskyIntegration from "@/components/BlueskyIntegration";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Smartphone, Video } from "lucide-react";
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";

const Index = () => {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    // Web landing page with app download focus
    return (
      <>
        <SEO />
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <div className="flex-1 pt-16">
            <div className="container mx-auto px-4 py-16">
              {/* Mobile App Hero */}
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Smartphone className="w-24 h-24 text-primary" />
                    <Video className="w-8 h-8 absolute -top-2 -right-2 text-secondary bg-background rounded-full p-1" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-authentic bg-clip-text text-transparent">
                  Authentic Moments
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  The mobile app for capturing real, unfiltered moments. 60 seconds to record - no retakes, no filters, just truth.
                </p>
                
                <Card className="max-w-md mx-auto p-6 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Download Required</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Video recording requires our mobile app for the authentic camera experience.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      Download for iOS
                    </Button>
                    <Button className="w-full" variant="outline" size="lg">
                      Download for Android
                    </Button>
                  </div>
                </Card>

                <Button asChild variant="ghost" className="mt-4">
                  <Link to="/capture">Try Web Preview</Link>
                </Button>
              </div>

              {/* App Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="p-6 text-center">
                  <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Native Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct camera access for authentic video recording without compromise.
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-timer rounded-full flex items-center justify-center text-white font-bold">
                    60
                  </div>
                  <h3 className="text-lg font-semibold mb-2">60 Second Limit</h3>
                  <p className="text-sm text-muted-foreground">
                    Time pressure creates authenticity. No time to fake it.
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">NO</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Retakes</h3>
                  <p className="text-sm text-muted-foreground">
                    One shot, one chance. Pure authenticity guaranteed.
                  </p>
                </Card>
              </div>
            </div>

            <MomentsFeed />
            <BlueskyIntegration />
          </div>
          <Footer />
        </div>
      </>
    );
  }

  // Native mobile app experience
  return (
    <>
      <SEO />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 pt-16">
          <Hero />
          <MomentsFeed />
          <BlueskyIntegration />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
