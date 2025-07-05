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
  ExternalLink 
} from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface BlueskyConnectProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const BlueskyConnect = ({ profile, onUpdate }: BlueskyConnectProps) => {
  const [loading, setLoading] = useState(false);
  const [blueskyHandle, setBlueskyHandle] = useState(profile?.bluesky_handle || '');
  const { toast } = useToast();

  const isConnected = !!profile?.bluesky_handle;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blueskyHandle.trim()) return;

    setLoading(true);
    
    try {
      // Basic validation for Bluesky handle format
      const cleanHandle = blueskyHandle.replace('@', '').trim();
      
      if (!cleanHandle.includes('.')) {
        throw new Error('Please enter a valid Bluesky handle (e.g., username.bsky.social)');
      }

      // For now, we'll just save the handle. In a real app, you'd verify it with AT Protocol
      await onUpdate({ 
        bluesky_handle: cleanHandle,
        bluesky_did: `did:plc:${cleanHandle}` // Simplified DID format
      });

      toast({
        title: "Success",
        description: "Bluesky account connected successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect Bluesky account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    
    try {
      await onUpdate({ 
        bluesky_handle: null,
        bluesky_did: null
      });
      setBlueskyHandle('');
      
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
    } finally {
      setLoading(false);
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

            <Button type="submit" disabled={loading || !blueskyHandle.trim()} className="gap-2">
              <LinkIcon className="w-4 h-4" />
              {loading ? 'Connecting...' : 'Connect Bluesky'}
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