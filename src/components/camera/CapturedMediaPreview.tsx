import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import BlueskyToggle from '@/components/BlueskyToggle';

interface CapturedMediaPreviewProps {
  mediaUrl: string;
  captureMode: 'photo' | 'video';
  captureTime: number;
  onSubmit: (content: string, postToBluesky?: boolean) => void;
  onRetake: () => void;
  isSubmitting?: boolean;
}

export const CapturedMediaPreview = ({
  mediaUrl,
  captureMode,
  captureTime,
  onSubmit,
  onRetake,
  isSubmitting = false
}: CapturedMediaPreviewProps) => {
  const [content, setContent] = useState('');
  const [postToBluesky, setPostToBluesky] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, postToBluesky);
    }
  };

  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Share Your Moment</h2>
            <p className="text-sm text-muted-foreground">
              Captured in {captureTime} seconds
            </p>
          </div>

          {/* Preview */}
          <div className="aspect-square rounded-xl overflow-hidden bg-muted">
            {captureMode === 'photo' ? (
              <img src={mediaUrl} alt="Captured moment" className="w-full h-full object-cover" />
            ) : (
              <video src={mediaUrl} controls className="w-full h-full object-cover" />
            )}
          </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">What's happening?</label>
              <Input
                placeholder="Describe your authentic moment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length}/200
              </p>
            </div>

            {/* Bluesky Toggle */}
            <BlueskyToggle
              enabled={postToBluesky}
              onToggle={setPostToBluesky}
              disabled={isSubmitting}
            />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onRetake}
              className="flex-1"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={!content.trim() || isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};