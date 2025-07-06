import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CameraPreview } from '@/components/camera/CameraPreview';
import { CameraControls } from '@/components/camera/CameraControls';
import { CapturedMediaPreview } from '@/components/camera/CapturedMediaPreview';
import { CaptureConfirmationDialog } from '@/components/CaptureConfirmationDialog';
import { useCamera } from '@/hooks/useCamera';
import { useMoments } from '@/hooks/useMoments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '@/hooks/useTimer';
import { useCapture } from '@/hooks/useCapture';

const CameraCaptureRefactored = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { stream, isInitializing, error, initCamera, cleanupCamera, retryCamera } = useCamera();
  const { createMoment } = useMoments();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    timeLeft, 
    isActive, 
    startTimer, 
    resetTimer, 
    getTimerColor, 
    formatTime 
  } = useTimer(60, cleanupCamera);
  
  const {
    isRecording,
    captureMode,
    capturedMedia,
    capturedUrl,
    setVideoRef,
    setCanvasRef,
    setCaptureMode,
    capturePhoto,
    startVideoRecording,
    stopVideoRecording,
    resetCapture
  } = useCapture();

  // Initialize camera when component mounts
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    initCamera(captureMode);
    // Don't include cleanup function in effect cleanup to avoid infinite loops
  }, [user, navigate, captureMode]); // Removed initCamera and cleanupCamera from deps

  // Separate cleanup effect
  useEffect(() => {
    return cleanupCamera;
  }, []);

  const handleCapture = () => {
    if (captureMode === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording(stream!);
      }
    }
  };

  const submitMoment = async (content: string, postToBluesky: boolean = false) => {
    if (!capturedMedia || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const captureTime = 60 - timeLeft;
      await createMoment(content, capturedMedia, captureTime, postToBluesky);
      
      toast({
        title: "Authentic Moment Shared!",
        description: postToBluesky 
          ? "Your raw, unfiltered moment is now live! No filters, no retakes - just pure authenticity."
          : "Your authentic moment has been shared with the community.",
      });

      // Reset and go back to home
      resetCapture();
      resetTimer();
      navigate('/');
    } catch (error) {
      console.error('Error creating moment:', error);
      toast({
        title: "Error",
        description: "Failed to share your moment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardMoment = () => {
    resetCapture();
    resetTimer();
  };

  const handleStartCapture = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCapture = () => {
    setShowConfirmDialog(false);
    startTimer();
  };

  // Show captured media preview
  if (capturedMedia && capturedUrl) {
    return (
      <CapturedMediaPreview
        mediaUrl={capturedUrl}
        captureMode={captureMode}
        captureTime={60 - timeLeft}
        onSubmit={submitMoment}
        onDiscard={handleDiscardMoment}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Camera Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={retryCamera} disabled={isInitializing}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {isInitializing ? 'Retrying...' : 'Retry Camera'}
          </Button>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing camera...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-black p-6 shadow-authentic">
          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getTimerColor()} transition-colors duration-300`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-white/70 text-sm mt-2">
              {isActive ? 'No retakes - make it count!' : 'One chance. One authentic moment.'}
            </p>
          </div>

          {/* Camera Viewfinder */}
          <CameraPreview
            stream={stream}
            onVideoRef={setVideoRef}
            onCanvasRef={setCanvasRef}
          />

          {/* Controls */}
          <CameraControls
            captureMode={captureMode}
            isActive={isActive}
            isRecording={isRecording}
            onModeChange={setCaptureMode}
            onStartCapture={handleStartCapture}
            onCapture={handleCapture}
          />

          {/* Progress Bar */}
          {isActive && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-timer h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>One authentic moment. No retakes. No filters. No excuses.</p>
          <p className="mt-1">60 seconds to capture something real.</p>
        </div>

        {/* Confirmation Dialog */}
        <CaptureConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmCapture}
          captureMode={captureMode}
        />
      </div>
    </div>
  );
};

export default CameraCaptureRefactored;