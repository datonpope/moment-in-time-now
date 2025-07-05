import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CameraPreview } from '@/components/camera/CameraPreview';
import { CameraControls } from '@/components/camera/CameraControls';
import { CapturedMediaPreview } from '@/components/camera/CapturedMediaPreview';
import { useCamera } from '@/hooks/useCamera';
import { useMoments } from '@/hooks/useMoments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CameraCaptureRefactored = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const { stream, isInitializing, error, initCamera, cleanupCamera, retryCamera } = useCamera();
  const { createMoment } = useMoments();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize camera when component mounts
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    initCamera(captureMode);
    return cleanupCamera;
  }, [user, navigate, initCamera, cleanupCamera, captureMode]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      cleanupCamera();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, cleanupCamera]);

  const startCapture = () => {
    setIsActive(true);
    setTimeLeft(60);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' });
          setCapturedMedia(file);
          setCapturedUrl(URL.createObjectURL(blob));
        }
      });
    }
  };

  const startVideoRecording = () => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      setCapturedMedia(file);
      setCapturedUrl(URL.createObjectURL(blob));
      setIsRecording(false);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopVideoRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  const handleCapture = () => {
    if (captureMode === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording();
      }
    }
  };

  const submitMoment = async (content: string) => {
    if (!capturedMedia || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const captureTime = 60 - timeLeft;
      await createMoment(content, capturedMedia, captureTime);
      
      toast({
        title: "Moment Shared!",
        description: "Your authentic moment has been shared with the community.",
      });

      resetCapture();
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

  const resetCapture = () => {
    setCapturedMedia(null);
    setCapturedUrl(null);
    setIsActive(false);
    setTimeLeft(60);
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-timer-critical';
    if (timeLeft <= 30) return 'text-timer-warning';
    return 'text-timer';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show captured media preview
  if (capturedMedia && capturedUrl) {
    return (
      <CapturedMediaPreview
        mediaUrl={capturedUrl}
        captureMode={captureMode}
        captureTime={60 - timeLeft}
        onSubmit={submitMoment}
        onRetake={resetCapture}
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
              {isActive ? 'Capture your authentic moment!' : 'Tap start to begin'}
            </p>
          </div>

          {/* Camera Viewfinder */}
          <CameraPreview
            stream={stream}
            onVideoRef={(ref) => { videoRef.current = ref; }}
            onCanvasRef={(ref) => { canvasRef.current = ref; }}
          />

          {/* Controls */}
          <CameraControls
            captureMode={captureMode}
            isActive={isActive}
            isRecording={isRecording}
            onModeChange={setCaptureMode}
            onStartCapture={startCapture}
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
          <p>You have 60 seconds to capture and share your authentic moment.</p>
          <p className="mt-1">No time for perfection, just pure authenticity!</p>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureRefactored;