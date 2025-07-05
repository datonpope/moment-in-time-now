import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertCircle, 
  Link as LinkIcon, 
  Unlink,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useBluesky } from "@/hooks/useBluesky";

interface BlueskyConnectProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const BlueskyConnect = ({ profile, onUpdate }: BlueskyConnectProps) => {
  const [blueskyHandle, setBlueskyHandle] = useState(profile?.bluesky_handle || '');
  const [blueskyPassword, setBlueskyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { loading, verifyCredentials } = useBluesky();

  const isConnected = !!profile?.bluesky_handle;

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

  const handleDisconnect = async () => {
    try {
      await onUpdate({ 
        bluesky_handle: null,
        bluesky_did: null
      });
      setBlueskyHandle('');
      setBlueskyPassword('');
      
      toast({
        title: "Success",
        description: "Bluesky account disconnected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect Bluesky account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bluesky Integration</h3>
        <p className="text-muted-foreground">
          Connect your Bluesky account to automatically share your authentic moments 
          with your followers on the open social web.
        </p>
      </div>

      {isConnected ? (
        <Card className="p-4 border-accent/20 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <div>
                <div className="font-medium">Connected to Bluesky</div>
                <div className="text-sm text-muted-foreground">
                  @{profile?.bluesky_handle}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                Connected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={loading}
                className="gap-2"
              >
                <Unlink className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </Card>
      ) : (
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
      )}

      <div className="space-y-4">
        <h4 className="font-medium">Benefits of Connecting</h4>
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <div className="font-medium text-sm">Automatic Sharing</div>
              <div className="text-sm text-muted-foreground">
                Your authentic moments are automatically posted to your Bluesky timeline
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <div className="font-medium text-sm">Authenticity Verification</div>
              <div className="text-sm text-muted-foreground">
                Posts include verification that content was captured within time limits
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <div className="font-medium text-sm">Open Social Web</div>
              <div className="text-sm text-muted-foreground">
                Leverage AT Protocol's decentralized network for maximum reach
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Don't have a Bluesky account yet?{' '}
            <a 
              href="https://bsky.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-1"
            >
              Sign up here <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlueskyConnect;