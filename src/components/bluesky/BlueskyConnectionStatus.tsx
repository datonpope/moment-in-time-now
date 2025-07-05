import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Unlink } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface BlueskyConnectionStatusProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

export const BlueskyConnectionStatus = ({ profile, onUpdate }: BlueskyConnectionStatusProps) => {
  const { toast } = useToast();

  const handleDisconnect = async () => {
    try {
      await onUpdate({ 
        bluesky_handle: null,
        bluesky_did: null
      });
      
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
            className="gap-2"
          >
            <Unlink className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      </div>
    </Card>
  );
};