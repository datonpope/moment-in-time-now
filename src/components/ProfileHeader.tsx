import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Calendar, Verified } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";

interface ProfileHeaderProps {
  profile: Profile | null;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!profile) return null;

  return (
    <div className="bg-gradient-authentic p-8 rounded-xl text-primary-foreground">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar className="w-24 h-24 border-4 border-primary-foreground/20">
          <AvatarImage src={profile.avatar_url || ''} />
          <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-bold text-2xl">
            {getInitials(profile.display_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">
              {profile.display_name || 'Anonymous User'}
            </h1>
            {profile.is_verified && (
              <Verified className="w-6 h-6 text-accent" fill="currentColor" />
            )}
          </div>
          
          {profile.bio && (
            <p className="text-primary-foreground/90 mb-4 max-w-2xl">
              {profile.bio}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            )}
            
            {profile.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
            </div>
          </div>
          
          {profile.bluesky_handle && (
            <div className="mt-3">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                @{profile.bluesky_handle}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex gap-6 text-center">
          <div>
            <div className="font-bold text-xl">{profile.moments_count}</div>
            <div className="text-sm text-primary-foreground/80">Moments</div>
          </div>
          <div>
            <div className="font-bold text-xl">{profile.follower_count}</div>
            <div className="text-sm text-primary-foreground/80">Followers</div>
          </div>
          <div>
            <div className="font-bold text-xl">{profile.following_count}</div>
            <div className="text-sm text-primary-foreground/80">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;