
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMoments } from '@/hooks/useMoments';
import { useTimer } from '@/hooks/useTimer';
import { useMediaRecording } from '@/hooks/useMediaRecording';
import { useCapture } from '@/hooks/useCapture';
import { useCamera } from '@/hooks/useCamera';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Video, Play, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

const MobileCaptureInterface = () => {
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('video');
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  
  const { user } = useAuth();
  const { createMoment } = useMoments();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    timeLeft, 
    isActive, 
    startTimer, 
    resetTimer, 
    getTimerColor, 
    formatTime 
  } = useTimer(60);
  
  const { recordVideo, isRecording, resetRecording } = useMediaRecording();
  
  const {
    capturedMedia,
    capturedUrl,
    resetCapture
  } = useCapture();

  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleStartCapture = () => {
    if (!isNative && captureMode === 'video') {
      setShowDownloadPrompt(true);
      return;
    }
    
    startTimer();
  };

  const handleVideoCapture = async () => {
    try {
      const videoPath = await recordVideo();
      if (videoPath) {
        console.log('Video recorded at:', videoPath);
        // Handle successful video recording
      }
    } catch (error) {
      console.error('Video capture failed:', error);
      toast({
        title: "Video Capture Failed",
        description: "Unable to access camera for video recording",
        variant: "destructive",
      });
    }
  };

  const handlePhotoCapture = async () => {
    // Photo capture logic would go here
    console.log('Photo capture not yet implemented');
  };

  const handleCapture = async () => {
    if (captureMode === 'video') {
      await handleVideoCapture();
    } else {
      await handlePhotoCapture();
    }
  };

  if (showDownloadPrompt) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <Download className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold mb-4">Download Mobile App</h2>
          <p className="text-muted-foreground mb-6">
            Video recording requires our mobile app for the authentic 60-second experience.
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => setShowDownloadPrompt(false)}>
              Download from App Store
            </Button>
            <Button variant="ghost" onClick={() => setShowDownloadPrompt(false)}>
              Back to Home
            </Button>
          </div>
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

          {/* Camera Preview Area */}
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
            <div className="text-white/50 text-center z-10">
              {captureMode === 'video' ? (
                <>
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Native Video Mode</p>
                  <p className="text-xs mt-1 opacity-70">
                    {isNative ? 'Tap capture to open camera' : 'Download app to record'}
                  </p>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Photo Mode</p>
                </>
              )}
            </div>
            
            {/* Corner indicators */}
            <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/30"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/30"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/30"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/30"></div>
          </div>

          {/* Controls */}
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
              >
                <Play className="w-8 h-8" />
              </Button>
            ) : (
              <Button
                variant="timer"
                size="icon"
                className="w-16 h-16 rounded-full"
                onClick={handleCapture}
                disabled={isRecording}
              >
                {captureMode === 'video' ? (
                  <Video className="w-8 h-8" />
                ) : (
                  <Camera className="w-8 h-8" />
                )}
              </Button>
            )}

            {/* Placeholder for layout balance */}
            <div className="w-20"></div>
          </div>

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
          {isNative ? (
            <p className="mt-1 text-xs text-primary">Native camera mode active</p>
          ) : (
            <p className="mt-1 text-xs text-orange-500">Web preview - download app for full experience</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCaptureInterface;
