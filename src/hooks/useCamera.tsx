
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { VideoRecorder } from '@capacitor-community/video-recorder';

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
  checkCameraPermissions: () => Promise<boolean>;
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

  const checkCameraPermissions = useCallback(async (): Promise<boolean> => {
    if (!isNative) return true;

    try {
      const permissions = await Camera.checkPermissions();
      console.log('Camera permissions:', permissions);
      
      if (permissions.camera === 'granted') {
        return true;
      }
      
      if (permissions.camera === 'prompt' || permissions.camera === 'prompt-with-rationale') {
        const requestResult = await Camera.requestPermissions();
        return requestResult.camera === 'granted';
      }
      
      return false;
    } catch (err) {
      console.error('Permission check failed:', err);
      return false;
    }
  }, [isNative]);

  const checkVideoPermissions = useCallback(async (): Promise<boolean> => {
    if (!isNative) return true;

    try {
      const permissions = await VideoRecorder.checkPermissions();
      console.log('Video recorder permissions:', permissions);
      
      if (permissions.camera === 'granted' && permissions.microphone === 'granted') {
        return true;
      }
      
      if (permissions.camera === 'prompt' || permissions.microphone === 'prompt' || 
          permissions.camera === 'prompt-with-rationale' || permissions.microphone === 'prompt-with-rationale') {
        const requestResult = await VideoRecorder.requestPermissions();
        return requestResult.camera === 'granted' && requestResult.microphone === 'granted';
      }
      
      return false;
    } catch (err) {
      console.error('Video permission check failed:', err);
      return false;
    }
  }, [isNative]);

  const takeNativePhoto = useCallback(async (): Promise<string | null> => {
    if (!isNative) return null;

    try {
      console.log('Taking native photo with camera direction:', facingMode === 'user' ? 'FRONT' : 'REAR');
      
      // Check permissions before taking photo
      const hasPermission = await checkCameraPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission denied. Please enable camera access in your device settings.');
      }
      
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
  }, [isNative, facingMode, toast, checkCameraPermissions]);

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
      // For native platforms, check permissions first
      if (isNative) {
        if (captureMode === 'photo') {
          const hasPermission = await checkCameraPermissions();
          if (!hasPermission) {
            throw new Error('Camera permission denied. Please enable camera access in your device settings.');
          }
          
          console.log('Native photo mode - permissions checked, ready for capture');
          setStream(null);
          setError(null);
          setIsInitializing(false);
          return;
        } else {
          // For video, check both camera and microphone permissions
          const hasPermission = await checkVideoPermissions();
          if (!hasPermission) {
            throw new Error('Camera and microphone permissions denied. Please enable access in your device settings.');
          }
          
          console.log('Native video mode - permissions checked, ready for recording');
          setStream(null);
          setError(null);
          setIsInitializing(false);
          return;
        }
      }

      // For web or when native video needs a stream for preview, use web APIs
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
  }, [toast, stream, isInitializing, facingMode, isNative, checkCameraPermissions, checkVideoPermissions]);

  const toggleCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // For native mode, no need to reinitialize stream
    if (isNative) {
      console.log('Native mode - camera direction will be used when capturing');
      return;
    }
    
    // Reinitialize camera with new facing mode for web
    if (stream) {
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
    takeNativePhoto,
    checkCameraPermissions
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
