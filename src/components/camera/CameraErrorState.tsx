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
      <Card className="w-full max-w-md p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Camera Error</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry} disabled={isRetrying}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {isRetrying ? 'Retrying...' : 'Retry Camera'}
        </Button>
      </Card>
    </div>
  );
};