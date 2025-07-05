import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseCameraReturn {
  stream: MediaStream | null;
  isInitializing: boolean;
  error: string | null;
  initCamera: (captureMode: 'photo' | 'video') => Promise<void>;
  cleanupCamera: () => void;
  retryCamera: () => Promise<void>;
}

export const useCamera = (): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCaptureMode, setLastCaptureMode] = useState<'photo' | 'video'>('photo');
  const { toast } = useToast();

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    setError(null);
  }, [stream]);

  const initCamera = useCallback(async (captureMode: 'photo' | 'video') => {
    setIsInitializing(true);
    setError(null);
    setLastCaptureMode(captureMode);

    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      // Request camera permission and stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: captureMode === 'video'
      });
      
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  }, [toast]);

  const retryCamera = useCallback(async () => {
    cleanupCamera();
    await initCamera(lastCaptureMode);
  }, [cleanupCamera, initCamera, lastCaptureMode]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanupCamera;
  }, [cleanupCamera]);

  return {
    stream,
    isInitializing,
    error,
    initCamera,
    cleanupCamera,
    retryCamera
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Camera access denied. Please allow camera permissions and try again.';
      case 'NotFoundError':
        return 'No camera found. Please connect a camera and try again.';
      case 'NotReadableError':
        return 'Camera is being used by another application. Please close other apps and try again.';
      case 'OverconstrainedError':
        return 'Camera settings not supported. Please try again.';
      case 'SecurityError':
        return 'Camera access blocked due to security restrictions.';
      default:
        return error.message || 'Failed to access camera. Please try again.';
    }
  }
  return 'Unknown camera error occurred.';
};