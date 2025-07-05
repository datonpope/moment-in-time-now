import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export const BlueskyBenefits = () => {
  return (
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
  );
};