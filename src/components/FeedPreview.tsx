import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare } from "lucide-react";

const FeedPreview = () => {
  const mockMoments = [
    {
      id: 1,
      user: { name: "Sarah Chen", handle: "@sarahc.bsky.social", avatar: "SC" },
      content: "Morning coffee before the chaos begins ☕",
      captureTime: "00:43",
      timeAgo: "2m ago",
      bgColor: "from-amber-100 to-orange-100"
    },
    {
      id: 2,
      user: { name: "Mike Torres", handle: "@miket.bsky.social", avatar: "MT" },
      content: "Caught the sunset just in time!",
      captureTime: "00:28",
      timeAgo: "12m ago",
      bgColor: "from-purple-100 to-pink-100"
    },
    {
      id: 3,
      user: { name: "Alex Rivera", handle: "@alexr.bsky.social", avatar: "AR" },
      content: "This coding session is getting intense 💻",
      captureTime: "00:52",
      timeAgo: "1h ago",
      bgColor: "from-green-100 to-blue-100"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real Moments, Real People</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every post is verified authentic - captured and shared within 60 seconds. 
            No time for perfection, just pure human connection.
          </p>
        </div>

        <div className="max-w-lg mx-auto space-y-6">
          {mockMoments.map((moment) => (
            <Card key={moment.id} className="p-6 shadow-soft">
              {/* User Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-authentic rounded-full flex items-center justify-center text-white font-semibold">
                  {moment.user.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{moment.user.name}</div>
                  <div className="text-muted-foreground text-xs">{moment.user.handle}</div>
                </div>
                
                {/* Authenticity Badge */}
                <div className="flex items-center gap-1 bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {moment.captureTime}
                </div>
              </div>

              {/* Mock Image Placeholder */}
              <div className={`aspect-square bg-gradient-to-br ${moment.bgColor} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="text-center z-10 text-gray-600">
                  <div className="text-lg font-semibold mb-1">Authentic Moment</div>
                  <div className="text-sm opacity-70">Captured in {moment.captureTime}</div>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground mb-3">{moment.content}</p>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2 h-8 px-2">
                    <MessageSquare className="w-4 h-4" />
                    3
                  </Button>
                  <span>Also on Bluesky</span>
                </div>
                <span>{moment.timeAgo}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            See More Authentic Moments
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeedPreview;