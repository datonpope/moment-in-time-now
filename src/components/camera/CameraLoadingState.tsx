import { Card } from '@/components/ui/card';

export const CameraLoadingState = () => {
  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center shadow-authentic">
        <div className="space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-4 border-transparent border-t-primary/50 mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Preparing Your Camera</h3>
            <p className="text-muted-foreground">Setting up for authentic capture...</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>One moment for authenticity</span>
          </div>
        </div>
      </Card>
    </div>
  );
};