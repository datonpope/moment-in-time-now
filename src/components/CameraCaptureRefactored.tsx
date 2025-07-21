
import { useState, useEffect } from 'react';
import { CapturedMediaPreview } from '@/components/camera/CapturedMediaPreview';
import { CameraLoadingState } from '@/components/camera/CameraLoadingState';
import { CameraErrorState } from '@/components/camera/CameraErrorState';
import { CameraInterface } from '@/components/camera/CameraInterface';
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
  
  const { 
    stream, 
    isInitializing, 
    error, 
    facingMode, 
    isNative, 
    initCamera, 
    cleanupCamera, 
    retryCamera, 
    toggleCamera,
    takeNativePhoto,
    checkCameraPermissions 
  } = useCamera();
  
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
    captureNativePhoto,
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
    
    const initialize = async () => {
      try {
        await initCamera(captureMode);
      } catch (error) {
        console.error('Failed to initialize camera:', error);
      }
    };
    
    initialize();
  }, [user, navigate, captureMode, initCamera]);

  // Separate cleanup effect
  useEffect(() => {
    return cleanupCamera;
  }, []);

  const handleCapture = async () => {
    if (captureMode === 'photo') {
      if (isNative) {
        // Use native camera for photo capture on mobile
        const photoDataUrl = await takeNativePhoto();
        if (photoDataUrl) {
          await captureNativePhoto(photoDataUrl);
        }
      } else {
        // Use web camera for photo capture
        capturePhoto();
      }
    } else {
      // Video recording
      if (isNative) {
        // For native video, start recording immediately opens the camera
        try {
          await startVideoRecording();
        } catch (error) {
          console.error('Error with native video recording:', error);
          toast({
            title: "Video Recording Error",
            description: "Failed to open native camera for video recording. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // For web, use the traditional record/stop pattern
        if (isRecording) {
          try {
            await stopVideoRecording();
          } catch (error) {
            console.error('Error stopping video recording:', error);
            toast({
              title: "Video Recording Error",
              description: "Failed to stop video recording. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          try {
            await startVideoRecording(stream || undefined);
          } catch (error) {
            console.error('Error starting video recording:', error);
            toast({
              title: "Video Recording Error",
              description: "Failed to start video recording. Please check your permissions and try again.",
              variant: "destructive",
            });
          }
        }
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

  const handleConfirmCapture = async () => {
    setShowConfirmDialog(false);
    startTimer();
    
    // For web video mode, auto-start recording when timer starts
    if (captureMode === 'video' && !isNative) {
      try {
        await startVideoRecording(stream || undefined);
      } catch (error) {
        console.error('Error auto-starting video recording:', error);
        toast({
          title: "Video Recording Error",
          description: "Failed to start video recording automatically. You can start it manually.",
          variant: "destructive",
        });
      }
    }
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
      <CameraErrorState
        error={error}
        onRetry={retryCamera}
        isRetrying={isInitializing}
      />
    );
  }

  // Show loading state
  if (isInitializing) {
    return <CameraLoadingState />;
  }

  return (
    <CameraInterface
      stream={stream}
      timeLeft={timeLeft}
      isActive={isActive}
      isRecording={isRecording}
      captureMode={captureMode}
      facingMode={facingMode}
      isNative={isNative}
      showConfirmDialog={showConfirmDialog}
      getTimerColor={getTimerColor}
      formatTime={formatTime}
      onVideoRef={setVideoRef}
      onCanvasRef={setCanvasRef}
      onModeChange={setCaptureMode}
      onStartCapture={handleStartCapture}
      onCapture={handleCapture}
      onToggleCamera={toggleCamera}
      onConfirmDialogChange={setShowConfirmDialog}
      onConfirmCapture={handleConfirmCapture}
    />
  );
};

export default CameraCaptureRefactored;
