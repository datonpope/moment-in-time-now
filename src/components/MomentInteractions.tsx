import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Send, Trash2 } from "lucide-react";
import { useInteractions } from "@/hooks/useInteractions";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MomentInteractionsProps {
  momentId: string;
}

const MomentInteractions = ({ momentId }: MomentInteractionsProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const {
    interactions: comments,
    loading,
    likesCount,
    commentsCount,
    isLiked,
    toggleLike,
    addComment,
    deleteComment
  } = useInteractions(momentId);
  
  const { user } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      await addComment(newComment);
      setNewComment("");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  return (
    <div className="space-y-3">
      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleLike}
          className={cn(
            "gap-2 h-8 px-2 transition-colors",
            isLiked && "text-red-500 hover:text-red-600"
          )}
        >
          <Heart 
            className={cn("w-4 h-4", isLiked && "fill-current")} 
          />
          {likesCount}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowComments(!showComments)}
          className="gap-2 h-8 px-2"
        >
          <MessageSquare className="w-4 h-4" />
          {commentsCount}
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3 pt-2 border-t">
          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={submittingComment}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!newComment.trim() || submittingComment}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {submittingComment ? "..." : "Post"}
              </Button>
            </form>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profiles?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-authentic text-white text-xs">
                      {getInitials(comment.profiles?.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {comment.profiles?.display_name || 'Anonymous'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                          {user?.id === comment.user_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MomentInteractions;