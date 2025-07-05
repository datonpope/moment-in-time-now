import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlueskyCredentials {
  handle: string;
  password: string;
}

export const useBluesky = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const verifyCredentials = async (credentials: BlueskyCredentials) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bluesky-post', {
        body: {
          action: 'verify',
          handle: credentials.handle,
          password: credentials.password
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error('Verification failed');

      return {
        success: true,
        did: data.did,
        handle: data.handle
      };
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Unable to verify Bluesky credentials",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const postToBluesky = async (
    credentials: BlueskyCredentials,
    content: string,
    momentId?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bluesky-post', {
        body: {
          action: 'post',
          handle: credentials.handle,
          password: credentials.password,
          content,
          momentId
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error('Post failed');

      toast({
        title: "Success",
        description: "Posted to Bluesky successfully!",
      });

      return {
        success: true,
        uri: data.uri
      };
    } catch (error: any) {
      toast({
        title: "Posting Failed",
        description: error.message || "Unable to post to Bluesky",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyCredentials,
    postToBluesky
  };
};