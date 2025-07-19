
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface UseCameraReturn {
  stream: MediaStream | null;
  isInitializing: boolean;
  error: string | null;
  facingMode: 'user' | 'environment';
  isNative: boolean;
  initCamera: (captureMode: 'photo' | 'video') => Promise<void>;
  cleanupCamera: () => void;
  retryCamera: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  takeNativePhoto: () => Promise<string | null>;
}

export const useCamera = (): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCaptureMode, setLastCaptureMode] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { toast } = useToast();

  // Check if we're running on a native platform
  const isNative = Capacitor.isNativePlatform();

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    setError(null);
  }, [stream]);

  const takeNativePhoto = useCallback(async (): Promise<string | null> => {
    if (!isNative) return null;

    try {
      console.log('Taking native photo with camera direction:', facingMode === 'user' ? 'FRONT' : 'REAR');
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: facingMode === 'user' ? CameraDirection.Front : CameraDirection.Rear,
      });

      return image.dataUrl || null;
    } catch (err) {
      console.error('Native camera error:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  }, [isNative, facingMode, toast]);

  const initCamera = useCallback(async (captureMode: 'photo' | 'video') => {
    console.log('Initializing camera for mode:', captureMode, 'isNative:', isNative);
    
    if (isInitializing) {
      console.log('Camera already initializing, skipping...');
      return;
    }

    setIsInitializing(true);
    setError(null);
    setLastCaptureMode(captureMode);

    try {
      // For native platforms, we don't need to initialize a stream for photos
      // We'll use the native camera API directly when capturing
      if (isNative && captureMode === 'photo') {
        console.log('Native photo mode - no stream initialization needed');
        setStream(null);
        setError(null);
        setIsInitializing(false);
        return;
      }

      // For web or native video, use web APIs
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      // Clean up existing stream first
      if (stream) {
        console.log('Cleaning up existing stream...');
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      console.log('Requesting camera permissions...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: captureMode === 'video'
      });
      
      console.log('Camera stream obtained successfully');
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error('Camera initialization failed:', err);
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
  }, [toast, stream, isInitializing, facingMode, isNative]);

  const toggleCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // For native photo mode, no need to reinitialize stream
    if (isNative && lastCaptureMode === 'photo') {
      console.log('Native photo mode - camera direction will be used when taking photo');
      return;
    }
    
    // Reinitialize camera with new facing mode for web or native video
    if (stream || (!isNative)) {
      await initCamera(lastCaptureMode);
    }
  }, [facingMode, stream, lastCaptureMode, initCamera, isNative]);

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
    facingMode,
    isNative,
    initCamera,
    cleanupCamera,
    retryCamera,
    toggleCamera,
    takeNativePhoto
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
