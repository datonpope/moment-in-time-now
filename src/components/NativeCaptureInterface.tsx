import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMoments } from '@/hooks/useMoments';
import { useTimer } from '@/hooks/useTimer';
import { useNativeCamera } from '@/hooks/useNativeCamera';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NativeCameraPreview } from '@/components/camera/NativeCameraPreview';
import { CaptureConfirmationDialog } from '@/components/CaptureConfirmationDialog';
import { Progress } from '@/components/ui/progress';
import { Camera, Video, Square, Play, RotateCcw } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export default function NativeCaptureInterface() {
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { createMoment } = useMoments();
  const { timeLeft, isActive, startTimer, resetTimer, formatTime, getTimerColor } = useTimer();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    isInitialized,
    isRecording,
    facingMode,
    error,
    initializeCamera,
    capturePhoto,
    startVideoRecording,
    stopVideoRecording,
    toggleCamera,
    cleanup
  } = useNativeCamera();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Initialize camera on mount
  useEffect(() => {
    if (user && Capacitor.isNativePlatform()) {
      initializeCamera();
    }
    
    return cleanup;
  }, [user, initializeCamera, cleanup]);

  // Handle timer completion
  useEffect(() => {
    if (isActive && timeLeft === 0) {
      handleCapture();
    }
  }, [isActive, timeLeft]);

  const handleStartCapture = () => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Mobile App Required",
        description: "Please download the mobile app to capture authentic moments.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmCapture = () => {
    setShowConfirmDialog(false);
    startTimer();
    
    // For video mode, start recording immediately
    if (captureMode === 'video') {
      startVideoRecording();
    }
  };

  const handleCapture = async () => {
    try {
      let mediaUrl: string | null = null;

      if (captureMode === 'photo') {
        mediaUrl = await capturePhoto();
      } else {
        mediaUrl = await stopVideoRecording();
      }

      if (mediaUrl) {
        setCapturedMedia(mediaUrl);
        resetTimer();
      }
    } catch (error) {
      console.error('Capture failed:', error);
      toast({
        title: "Capture Failed",
        description: "Failed to capture media. Please try again.",
        variant: "destructive",
      });
      resetTimer();
    }
  };

  const handleSubmit = async (content: string, postToBluesky: boolean) => {
    if (!capturedMedia) return;

    setIsSubmitting(true);
    try {
      // Convert data URL to File for upload
      const response = await fetch(capturedMedia);
      const blob = await response.blob();
      const file = new File([blob], `moment-${Date.now()}.${captureMode === 'photo' ? 'jpg' : 'mp4'}`, {
        type: captureMode === 'photo' ? 'image/jpeg' : 'video/mp4'
      });

      await createMoment(content, file, Date.now(), postToBluesky);

      toast({
        title: "Moment Shared!",
        description: "Your authentic moment has been captured and shared.",
      });

      // Reset state
      setCapturedMedia(null);
      resetTimer();
      navigate('/');
      
    } catch (error) {
      console.error('Failed to create moment:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share your moment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setCapturedMedia(null);
    resetTimer();
  };

  if (!user) {
    return null;
  }

  if (!Capacitor.isNativePlatform()) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center shadow-authentic">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Mobile App Required</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Authentic Moments requires the mobile app for camera access. 
                Please download from your app store to capture real moments.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/')}
              variant="authentic"
              className="w-full"
            >
              Back to Feed
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center shadow-authentic">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-destructive">Camera Error</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{error}</p>
            </div>
            
            <Button 
              onClick={initializeCamera}
              variant="authentic"
              className="w-full"
            >
              Retry Camera Access
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (capturedMedia) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center shadow-authentic">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Moment Captured!</h2>
              {captureMode === 'photo' ? (
                <img src={capturedMedia} alt="Captured moment" className="w-full rounded-lg" />
              ) : (
                <video src={capturedMedia} controls className="w-full rounded-lg" />
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDiscard}
                disabled={isSubmitting}
                className="flex-1"
              >
                Discard
              </Button>
              <Button
                variant="authentic"
                onClick={() => handleSubmit("Authentic moment", false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const progress = ((60 - timeLeft) / 60) * 100;

  return (
    <div className="min-h-screen bg-card p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Timer */}
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
          {isActive && (
            <div className="text-sm text-muted-foreground mt-2">
              {captureMode === 'video' && isRecording ? 'Recording...' : 'Get ready...'}
            </div>
          )}
        </div>

        {/* Camera Preview */}
        <NativeCameraPreview facingMode={facingMode} />

        {/* Mode Toggle & Controls */}
        <div className="flex items-center justify-between">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={captureMode === 'photo' ? 'authentic' : 'ghost'}
              size="sm"
              onClick={() => setCaptureMode('photo')}
              className="text-white"
              disabled={isActive}
            >
              <Camera className="w-4 h-4" />
            </Button>
            <Button
              variant={captureMode === 'video' ? 'authentic' : 'ghost'}
              size="sm"
              onClick={() => setCaptureMode('video')}
              className="text-white"
              disabled={isActive}
            >
              <Video className="w-4 h-4" />
            </Button>
          </div>

          {/* Capture Button */}
          {!isActive ? (
            <Button
              variant="timer"
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={handleStartCapture}
              disabled={!isInitialized}
            >
              <Play className="w-8 h-8" />
            </Button>
          ) : (
            <Button
              variant="timer"
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={handleCapture}
            >
              {captureMode === 'video' && isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <Camera className="w-8 h-8" />
              )}
            </Button>
          )}

          {/* Camera Flip Button */}
          <div className="flex justify-end w-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCamera}
              className="text-white p-2"
              disabled={isActive}
              title={`Switch to ${facingMode === 'user' ? 'back' : 'front'} camera`}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {isActive && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              Capturing your authentic moment...
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            {captureMode === 'photo' 
              ? 'Tap to start 60-second timer, then capture your photo' 
              : 'Tap to start recording for up to 60 seconds'
            }
          </p>
          <p className="text-xs opacity-70">
            No filters, no edits - just authentic moments
          </p>
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
}