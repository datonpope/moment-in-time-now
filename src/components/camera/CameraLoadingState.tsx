import { Card } from '@/components/ui/card';

export const CameraLoadingState = () => {
  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Initializing camera...</p>
      </Card>
    </div>
  );
};