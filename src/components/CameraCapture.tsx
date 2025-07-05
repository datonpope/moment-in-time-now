import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Camera, Video, Square, Play, Send, X } from 'lucide-react';
import { useMoments } from '@/hooks/useMoments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CameraCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { createMoment } = useMoments();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: captureMode === 'video'
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [captureMode, toast]);

  // Cleanup camera
  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  }, [stream, mediaRecorder]);

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

  // Initialize camera when component mounts
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    initCamera();
    return cleanupCamera;
  }, [user, navigate, initCamera, cleanupCamera]);

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
    const captureTime = 60 - timeLeft;
    
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

  const submitMoment = async () => {
    if (!capturedMedia || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please add a description for your moment.",
        variant: "destructive",
      });
      return;
    }

    try {
      const captureTime = 60 - timeLeft;
      await createMoment(content, capturedMedia, captureTime);
      
      toast({
        title: "Moment Shared!",
        description: "Your authentic moment has been shared with the community.",
      });

      // Reset form
      setCapturedMedia(null);
      setCapturedUrl(null);
      setContent('');
      setIsActive(false);
      setTimeLeft(60);
      
      // Navigate to home to see the new moment
      navigate('/');
    } catch (error) {
      console.error('Error creating moment:', error);
      toast({
        title: "Error",
        description: "Failed to share your moment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetCapture = () => {
    setCapturedMedia(null);
    setCapturedUrl(null);
    setContent('');
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

  if (capturedMedia && capturedUrl) {
    return (
      <div className="min-h-screen bg-card p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Share Your Moment</h2>
              <p className="text-sm text-muted-foreground">
                Captured in {60 - timeLeft} seconds
              </p>
            </div>

            {/* Preview */}
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              {captureMode === 'photo' ? (
                <img src={capturedUrl} alt="Captured moment" className="w-full h-full object-cover" />
              ) : (
                <video src={capturedUrl} controls className="w-full h-full object-cover" />
              )}
            </div>

            {/* Content Input */}
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

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetCapture}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={submitMoment}
                className="flex-1"
                disabled={!content.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Camera Interface */}
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
          <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
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
                onClick={startCapture}
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

            {/* Placeholder for balance */}
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
          <p>You have 60 seconds to capture and share your authentic moment.</p>
          <p className="mt-1">No time for perfection, just pure authenticity!</p>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;