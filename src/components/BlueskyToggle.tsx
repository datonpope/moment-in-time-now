import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BlueskyToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

const BlueskyToggle = ({ enabled, onToggle, disabled = false }: BlueskyToggleProps) => {
  const [hasBlueskyAccount, setHasBlueskyAccount] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkBlueskyConnection();
    }
  }, [user]);

  const checkBlueskyConnection = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('bluesky_handle')
        .eq('user_id', user?.id)
        .single();
      
      setHasBlueskyAccount(!!data?.bluesky_handle);
    } catch (error) {
      console.error('Error checking Bluesky connection:', error);
    }
  };

  if (!hasBlueskyAccount) {
    return (
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Share to Bluesky</Label>
          <Badge variant="outline" className="text-xs">
            Not connected
          </Badge>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
      <div className="flex items-center gap-2">
        <Label htmlFor="bluesky-toggle" className="text-sm cursor-pointer">
          Share to Bluesky
        </Label>
        <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary">
          Connected
        </Badge>
      </div>
      <Switch
        id="bluesky-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
};

export default BlueskyToggle;