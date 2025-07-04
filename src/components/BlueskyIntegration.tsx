import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";

const BlueskyIntegration = () => {
  return (
    <section className="py-16 bg-gradient-natural">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powered by Bluesky & AT Protocol</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your authentic moments automatically sync to your Bluesky timeline, 
              connecting you with the open social web while maintaining authenticity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Integration Benefits */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Seamless Social Integration</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                    <span>Auto-post to your Bluesky timeline with authenticity verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                    <span>Connect with your existing Bluesky followers and discover new ones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                    <span>Leverage AT Protocol's open network for maximum reach</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                    <span>Your data stays yours with decentralized architecture</span>
                  </li>
                </ul>
              </div>

              <Button variant="bluesky" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Connect Your Bluesky Account
              </Button>
            </div>

            {/* Mock Bluesky Post */}
            <Card className="p-6 shadow-soft bg-card">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-authentic rounded-full flex items-center justify-center text-white font-semibold">
                    YU
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">You</div>
                    <div className="text-muted-foreground text-xs">@yourhandle.bsky.social</div>
                  </div>
                  <div className="flex items-center gap-1 bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    Authentic
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                  <p className="text-foreground">
                    Just captured an authentic moment in 45 seconds! No filters, no edits, just real life. 
                    #AuthenticMoments #Bluesky
                  </p>
                  
                  {/* Mock Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="text-sm font-medium">Your Authentic Moment</div>
                      <div className="text-xs opacity-70">Captured & shared in real-time</div>
                    </div>
                  </div>
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                  <span>Posted to Bluesky & Authentic Moments</span>
                  <span>•</span>
                  <span>2 minutes ago</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlueskyIntegration;