import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { VideoRecorder } from '@capacitor-community/video-recorder';
import { useToast } from '@/hooks/use-toast';

interface UseNativeCameraReturn {
  isInitialized: boolean;
  isRecording: boolean;
  facingMode: 'user' | 'environment';
  error: string | null;
  initializeCamera: () => Promise<void>;
  capturePhoto: () => Promise<string | null>;
  startVideoRecording: () => Promise<void>;
  stopVideoRecording: () => Promise<string | null>;
  toggleCamera: () => void;
  cleanup: () => void;
}

export const useNativeCamera = (): UseNativeCameraReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initializeCamera = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      setError('Native camera requires mobile app');
      return;
    }

    try {
      setError(null);
      
      // Check camera permissions first
      const permissions = await Camera.checkPermissions();
      console.log('Camera permissions status:', permissions);
      
      if (permissions.camera !== 'granted') {
        console.log('Requesting camera permissions...');
        const requestResult = await Camera.requestPermissions();
        
        if (requestResult.camera !== 'granted') {
          setError('Camera permission denied. Please enable camera access in your device settings.');
          
          toast({
            title: "Permission Required",
            description: "Camera access is required to capture moments. Please enable it in your device settings.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Initialize video recorder after permissions are granted
      await VideoRecorder.initialize();
      setIsInitialized(true);
      
      console.log('Native camera initialized successfully with permissions');
      
      toast({
        title: "Camera Ready",
        description: "Your camera is ready to capture authentic moments!",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Camera initialization failed:', error);
      setError('Failed to initialize camera. Please check permissions and try again.');
      
      toast({
        title: "Camera Error",
        description: "Failed to initialize camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      setError('Photo capture requires mobile app');
      return null;
    }

    try {
      // Ensure permissions are still valid
      const permissions = await Camera.checkPermissions();
      if (permissions.camera !== 'granted') {
        setError('Camera permission is required to capture photos');
        return null;
      }

      console.log('Opening native camera for photo capture...');
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: facingMode === 'user' ? CameraDirection.Front : CameraDirection.Rear,
      });

      console.log('Photo captured successfully');
      return image.dataUrl || null;
      
    } catch (error) {
      console.error('Photo capture failed:', error);
      
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
          console.log('Photo capture was cancelled by user');
          return null; // Don't show error toast for user cancellation
        }
      }
      
      setError('Failed to capture photo');
      
      toast({
        title: "Capture Error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive",
      });
      
      return null;
    }
  }, [facingMode, toast]);

  const startVideoRecording = useCallback(async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
      setError('Video recording requires mobile app');
      return;
    }

    if (!isInitialized) {
      await initializeCamera();
    }

    try {
      // Double-check permissions before recording
      const permissions = await Camera.checkPermissions();
      if (permissions.camera !== 'granted') {
        setError('Camera permission is required for video recording');
        return;
      }

      setIsRecording(true);
      setError(null);
      
      console.log('Starting native video recording...');
      
      await VideoRecorder.startRecording();
      
      console.log('Video recording started successfully');
      
    } catch (error) {
      console.error('Failed to start video recording:', error);
      setError('Failed to start recording');
      setIsRecording(false);
      
      toast({
        title: "Recording Error",
        description: "Failed to start video recording. Please try again.",
        variant: "destructive",
      });
    }
  }, [isInitialized, initializeCamera, facingMode, toast]);

  const stopVideoRecording = useCallback(async (): Promise<string | null> => {
    if (!isRecording) {
      return null;
    }

    try {
      const result = await VideoRecorder.stopRecording();
      setIsRecording(false);
      
      console.log('Video recording stopped:', result);
      return result.videoUrl || null;
      
    } catch (error) {
      console.error('Failed to stop video recording:', error);
      setError('Failed to stop recording');
      setIsRecording(false);
      
      toast({
        title: "Recording Error",
        description: "Failed to stop video recording. Please try again.",
        variant: "destructive",
      });
      
      return null;
    }
  }, [isRecording, toast]);

  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const cleanup = useCallback(() => {
    if (isRecording) {
      VideoRecorder.stopRecording().catch(console.error);
      setIsRecording(false);
    }
    setIsInitialized(false);
    setError(null);
  }, [isRecording]);

  return {
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
  };
};