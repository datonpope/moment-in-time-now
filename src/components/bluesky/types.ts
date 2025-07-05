import { Profile } from "@/hooks/useProfile";

export interface BlueskyConnectProps {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}