import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link as LinkIcon, Eye, EyeOff } from "lucide-react";
import { useBluesky } from "@/hooks/useBluesky";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/hooks/useProfile";

interface BlueskyConnectionFormProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

export const BlueskyConnectionForm = ({ profile, onUpdate }: BlueskyConnectionFormProps) => {
  const [blueskyHandle, setBlueskyHandle] = useState(profile?.bluesky_handle || '');
  const [blueskyPassword, setBlueskyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { loading, verifyCredentials } = useBluesky();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blueskyHandle.trim() || !blueskyPassword.trim()) return;

    try {
      // Clean handle format
      const cleanHandle = blueskyHandle.replace('@', '').trim();
      
      if (!cleanHandle.includes('.')) {
        throw new Error('Please enter a valid Bluesky handle (e.g., username.bsky.social)');
      }

      // Verify credentials with Bluesky
      const result = await verifyCredentials({
        handle: cleanHandle,
        password: blueskyPassword
      });

      if (result.success) {
        await onUpdate({ 
          bluesky_handle: result.handle,
          bluesky_did: result.did
        });

        toast({
          title: "Success",
          description: "Bluesky account connected and verified!",
        });
        
        setBlueskyPassword(''); // Clear password after successful connection
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect Bluesky account",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <Label htmlFor="bluesky_handle">Bluesky Handle</Label>
          <Input
            id="bluesky_handle"
            value={blueskyHandle}
            onChange={(e) => setBlueskyHandle(e.target.value)}
            placeholder="username.bsky.social"
            disabled={loading}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Enter your Bluesky handle (without the @)
          </p>
        </div>

        <div>
          <Label htmlFor="bluesky_password">App Password</Label>
          <div className="relative">
            <Input
              id="bluesky_password"
              type={showPassword ? "text" : "password"}
              value={blueskyPassword}
              onChange={(e) => setBlueskyPassword(e.target.value)}
              placeholder="Enter your Bluesky app password"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Create an app password in your Bluesky settings for secure access
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={loading || !blueskyHandle.trim() || !blueskyPassword.trim()} 
          className="gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          {loading ? 'Verifying...' : 'Connect & Verify'}
        </Button>
      </form>
    </Card>
  );
};