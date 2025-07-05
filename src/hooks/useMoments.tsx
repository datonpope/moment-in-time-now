import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Moment {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  capture_time: number;
  created_at: string;
  bluesky_uri: string | null;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useMoments = () => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMoments = async () => {
    try {
      const { data, error } = await supabase
        .from('moments')
        .select(`
          *,
          profiles!inner(display_name, avatar_url)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMoments((data as any) || []);
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('moments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moments'
        },
        () => {
          fetchMoments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createMoment = async (
    content: string,
    mediaFile: File | null,
    captureTime: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      let mediaUrl = null;
      let mediaType = null;

      // Upload media file if provided
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('moments')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('moments')
          .getPublicUrl(fileName);

        mediaUrl = publicUrl;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

      const { data, error } = await supabase
        .from('moments')
        .insert({
          user_id: user.id,
          content,
          media_url: mediaUrl,
          media_type: mediaType,
          capture_time: captureTime
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating moment:', error);
      throw error;
    }
  };

  return {
    moments,
    loading,
    createMoment,
    refetch: fetchMoments
  };
};