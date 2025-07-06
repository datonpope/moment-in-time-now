import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OptimizedMoment {
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
  interactions_count?: number;
  user_liked?: boolean;
}

export const useOptimizedMoments = (limit: number = 20) => {
  const [moments, setMoments] = useState<OptimizedMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { user } = useAuth();

  // Optimized query with single join and aggregation
  const fetchMoments = useCallback(async (isLoadMore = false) => {
    try {
      const currentOffset = isLoadMore ? offset : 0;
      
      // Use a more efficient query with proper indexing
      const { data, error } = await supabase
        .from('moments')
        .select(`
          id,
          user_id,
          content,
          media_url,
          media_type,
          capture_time,
          created_at,
          bluesky_uri,
          profiles!inner(display_name, avatar_url)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      if (error) throw error;

      const newMoments = (data as any) || [];
      
      // Batch fetch interaction counts for all moments
      if (newMoments.length > 0) {
        const momentIds = newMoments.map((m: any) => m.id);
        
        // Get interaction counts in a single query
        const { data: interactionData } = await supabase
          .from('interactions')
          .select('moment_id, type, user_id')
          .in('moment_id', momentIds);

        // Process interaction data efficiently
        const interactionMap = new Map();
        const userLikes = new Set();

        (interactionData || []).forEach((interaction: any) => {
          const momentId = interaction.moment_id;
          if (!interactionMap.has(momentId)) {
            interactionMap.set(momentId, 0);
          }
          interactionMap.set(momentId, interactionMap.get(momentId) + 1);
          
          if (user && interaction.user_id === user.id && interaction.type === 'like') {
            userLikes.add(momentId);
          }
        });

        // Enhance moments with interaction data
        newMoments.forEach((moment: any) => {
          moment.interactions_count = interactionMap.get(moment.id) || 0;
          moment.user_liked = userLikes.has(moment.id);
        });
      }

      if (isLoadMore) {
        setMoments(prev => [...prev, ...newMoments]);
      } else {
        setMoments(newMoments);
      }

      setHasMore(newMoments.length === limit);
      setOffset(prev => isLoadMore ? prev + limit : limit);
      
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, user]);

  // Memoized real-time subscription
  const subscription = useMemo(() => {
    return supabase
      .channel('optimized-moments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moments'
        },
        () => {
          // Only refetch if we're on the first page
          if (offset <= limit) {
            fetchMoments(false);
          }
        }
      );
  }, [fetchMoments, limit, offset]);

  useEffect(() => {
    fetchMoments(false);
  }, []);

  useEffect(() => {
    subscription.subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [subscription]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMoments(true);
    }
  }, [fetchMoments, loading, hasMore]);

  const refetch = useCallback(() => {
    setOffset(0);
    fetchMoments(false);
  }, [fetchMoments]);

  return {
    moments,
    loading,
    hasMore,
    loadMore,
    refetch
  };
};

// Optimized interactions hook with caching
export const useOptimizedInteractions = (momentId: string) => {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ likes: 0, comments: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  // Cache key for localStorage
  const cacheKey = `interactions_${momentId}`;

  const fetchInteractions = useCallback(async () => {
    try {
      // Try cache first for better perceived performance
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 30000) { // 30 second cache
          setInteractions(cachedData);
          setLoading(false);
        }
      }

      // Optimized query with aggregation
      const { data, error } = await supabase
        .from('interactions')
        .select(`
          id,
          type,
          content,
          user_id,
          created_at,
          profiles!inner(display_name, avatar_url)
        `)
        .eq('moment_id', momentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const interactionData = (data as any) || [];
      setInteractions(interactionData);

      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify({
        data: interactionData,
        timestamp: Date.now()
      }));

      // Calculate counts efficiently
      const likes = interactionData.filter((i: any) => i.type === 'like');
      const comments = interactionData.filter((i: any) => i.type === 'comment');
      
      setCounts({ likes: likes.length, comments: comments.length });
      
      if (user) {
        setIsLiked(likes.some((like: any) => like.user_id === user.id));
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  }, [momentId, cacheKey, user]);

  useEffect(() => {
    fetchInteractions();

    // Optimized real-time subscription
    const channel = supabase
      .channel(`interactions-${momentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'interactions',
          filter: `moment_id=eq.${momentId}`
        },
        () => {
          // Clear cache and refetch
          localStorage.removeItem(cacheKey);
          fetchInteractions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInteractions, momentId, cacheKey]);

  return {
    interactions: interactions.filter(i => i.type === 'comment'),
    loading,
    likesCount: counts.likes,
    commentsCount: counts.comments,
    isLiked
  };
};