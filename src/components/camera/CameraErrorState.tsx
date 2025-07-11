import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CameraErrorStateProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const CameraErrorState = ({ 
  error, 
  onRetry, 
  isRetrying = false 
}: CameraErrorStateProps) => {
  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center shadow-authentic">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-destructive">Camera Access Issue</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{error}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-2">Common solutions:</p>
            <ul className="text-xs space-y-1 text-left">
              <li>• Allow camera permissions in your browser</li>
              <li>• Close other apps using the camera</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
          
          <Button 
            onClick={onRetry} 
            disabled={isRetrying}
            className="w-full"
            variant="authentic"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying Camera Access...' : 'Try Again'}
          </Button>
        </div>
      </Card>
    </div>
  );
};