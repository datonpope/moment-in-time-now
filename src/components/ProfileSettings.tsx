import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading";
import { useFieldValidation, ValidationFeedback, validationRules } from "@/components/ui/form-validation";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProfileSettingsProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const ProfileSettings = ({ profile, onUpdate }: ProfileSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Enhanced form validation
  const displayName = useFieldValidation(profile?.display_name || '');
  const bio = useFieldValidation(profile?.bio || '');
  const website = useFieldValidation(profile?.website || '');
  const location = useFieldValidation(profile?.location || '');

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes to show unsaved indicator
  useEffect(() => {
    const hasChanges = 
      displayName.value !== (profile?.display_name || '') ||
      bio.value !== (profile?.bio || '') ||
      website.value !== (profile?.website || '') ||
      location.value !== (profile?.location || '');
    
    setHasUnsavedChanges(hasChanges);
  }, [displayName.value, bio.value, website.value, location.value, profile]);

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      displayName.setValue(profile.display_name || '', 'displayName');
      bio.setValue(profile.bio || '');
      website.setValue(profile.website || '', 'url');
      location.setValue(profile.location || '');
    }
  }, [profile?.id]); // Only update when profile ID changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isDisplayNameValid = displayName.value ? displayName.validate(displayName.value, 'displayName').isValid : true;
    const isWebsiteValid = website.value ? website.validate(website.value, 'url').isValid : true;
    
    if (!isDisplayNameValid || !isWebsiteValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const updates = {
        display_name: displayName.value.trim() || null,
        bio: bio.value.trim() || null,
        website: website.value.trim() || null,
        location: location.value.trim() || null,
      };

      await onUpdate(updates);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Enhanced file validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or GIF image",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }


    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage with progress
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await onUpdate({ avatar_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <LoadingOverlay isLoading={loading} message="Saving profile...">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-authentic text-primary-foreground font-bold text-xl">
                  {getInitials(profile?.display_name)}
                </AvatarFallback>
              </Avatar>
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <LoadingSpinner size="sm" className="text-white" />
                </div>
              )}
            </div>
            
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
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
              />
              <p className="text-sm text-muted-foreground mt-1">
                JPEG, PNG, GIF or WebP. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={displayName.value}
              onChange={(e) => displayName.setValue(e.target.value, 'displayName')}
              onBlur={() => displayName.onBlur('displayName')}
              placeholder="Your display name"
              maxLength={30}
            />
            <ValidationFeedback 
              isValid={!displayName.error} 
              message={displayName.error || (displayName.value && displayName.isValid ? 'Looks good!' : '')} 
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio.value}
              onChange={(e) => bio.setValue(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{bio.value.length}/160 characters</span>
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={website.value}
              onChange={(e) => website.setValue(e.target.value, 'url')}
              onBlur={() => website.onBlur('url')}
              placeholder="https://your-website.com"
              type="url"
            />
            <ValidationFeedback 
              isValid={!website.error} 
              message={website.error || (website.value && website.isValid ? 'Valid URL!' : '')} 
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location.value}
              onChange={(e) => location.setValue(e.target.value)}
              placeholder="Your location"
              maxLength={50}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || uploadingAvatar || !hasUnsavedChanges} 
            className="gap-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <User className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </LoadingOverlay>
  );
};

export default ProfileSettings;