import { BlueskyConnectionForm } from "@/components/bluesky/BlueskyConnectionForm";
import { BlueskyConnectionStatus } from "@/components/bluesky/BlueskyConnectionStatus";
import { BlueskyBenefits } from "@/components/bluesky/BlueskyBenefits";
import { BlueskyConnectProps } from "@/components/bluesky/types";

const BlueskyConnect = ({ profile, onUpdate }: BlueskyConnectProps) => {
  const isConnected = !!profile?.bluesky_handle;

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
        <BlueskyConnectionStatus profile={profile} onUpdate={onUpdate} />
      ) : (
        <BlueskyConnectionForm profile={profile} onUpdate={onUpdate} />
      )}

      <BlueskyBenefits />
    </div>
  );
};

export default BlueskyConnect;