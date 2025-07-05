import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Interaction {
  id: string;
  user_id: string;
  moment_id: string;
  type: 'like' | 'comment';
  content: string | null;
  created_at: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useInteractions = (momentId: string) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select(`
          *,
          profiles!inner(display_name, avatar_url)
        `)
        .eq('moment_id', momentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const interactions = (data as any) || [];
      setInteractions(interactions);
      
      const likes = interactions.filter((i: Interaction) => i.type === 'like');
      const comments = interactions.filter((i: Interaction) => i.type === 'comment');
      
      setLikesCount(likes.length);
      setCommentsCount(comments.length);
      
      if (user) {
        setIsLiked(likes.some((like: Interaction) => like.user_id === user.id));
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like moments",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('interactions')
          .delete()
          .eq('moment_id', momentId)
          .eq('user_id', user.id)
          .eq('type', 'like');

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('interactions')
          .insert({
            moment_id: momentId,
            user_id: user.id,
            type: 'like'
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .insert({
          moment_id: momentId,
          user_id: user.id,
          type: 'comment',
          content: content.trim()
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Comment added!",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInteractions();

    // Subscribe to real-time updates
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
          fetchInteractions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [momentId, user]);

  return {
    interactions: interactions.filter(i => i.type === 'comment'),
    loading,
    likesCount,
    commentsCount,
    isLiked,
    toggleLike,
    addComment,
    deleteComment
  };
};