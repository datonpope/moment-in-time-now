import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare, Camera, Plus } from "lucide-react";
import { useOptimizedMoments } from "@/hooks/useOptimizedQueries";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import MomentInteractions from "@/components/MomentInteractions";

const MomentsFeed = () => {
  const { moments, loading, hasMore, loadMore } = useOptimizedMoments();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackUserAction } = useAnalytics();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Authentic Moments</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real moments from real people - captured and shared within 60 seconds. 
            No filters, no staging, just pure human connection.
          </p>
        </div>

        {/* Create Moment Button */}
        {user && (
          <div className="text-center mb-8">
            <Button 
              onClick={() => navigate('/capture')}
              variant="authentic"
              size="lg"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Share Your Moment
            </Button>
          </div>
        )}

        <div className="max-w-lg mx-auto space-y-6">
          {moments.length === 0 ? (
            <Card className="p-8 text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No moments yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share an authentic moment with the community!
              </p>
              {user ? (
                <Button onClick={() => navigate('/capture')} variant="outline">
                  Create First Moment
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')} variant="outline">
                  Join the Community
                </Button>
              )}
            </Card>
          ) : (
            moments.map((moment) => (
              <Card key={moment.id} className="p-6 shadow-soft">
                {/* User Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={moment.profiles?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-authentic text-white font-semibold">
                      {getInitials(moment.profiles?.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {moment.profiles?.display_name || 'Anonymous User'}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      @user{moment.user_id.slice(0, 8)}
                    </div>
                  </div>
                  
                  {/* Authenticity Badge */}
                  <div className="flex items-center gap-1 bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    {formatTime(moment.capture_time)}
                  </div>
                </div>

                {/* Media */}
                {moment.media_url && (
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
                    {moment.media_type === 'image' ? (
                      <img 
                        src={moment.media_url} 
                        alt="Authentic moment" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : moment.media_type === 'video' ? (
                      <video 
                        src={moment.media_url} 
                        controls 
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    ) : null}
                  </div>
                )}

                {/* Content */}
                <p className="text-foreground mb-3">{moment.content}</p>

                {/* Interactions */}
                <MomentInteractions momentId={moment.id} />

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    {moment.bluesky_uri && (
                      <span className="text-xs">Also on Bluesky</span>
                    )}
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(moment.created_at), { addSuffix: true })}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {moments.length > 0 && hasMore && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                loadMore();
                trackUserAction('load_more_moments');
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Moments'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MomentsFeed;