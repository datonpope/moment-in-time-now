import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const ProfileSettings = ({ profile, onUpdate }: ProfileSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await onUpdate({ avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-authentic text-primary-foreground font-bold text-xl">
              {getInitials(profile?.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <Button 
                variant="outline" 
                disabled={uploadingAvatar}
                className="gap-2"
                type="button"
              >
                <Upload className="w-4 h-4" />
                {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
              </Button>
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => handleInputChange('display_name', e.target.value)}
            placeholder="Your display name"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://your-website.com"
            type="url"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Your location"
          />
        </div>

        <Button type="submit" disabled={loading} className="gap-2">
          <User className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileSettings;