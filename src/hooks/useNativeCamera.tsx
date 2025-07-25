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
      
      // Initialize video recorder
      await VideoRecorder.initialize();
      setIsInitialized(true);
      
      console.log('Native camera initialized successfully');
    } catch (error) {
      console.error('Camera initialization failed:', error);
      setError('Failed to initialize camera. Please check permissions.');
      
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
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: facingMode === 'user' ? CameraDirection.Front : CameraDirection.Rear,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Photo capture failed:', error);
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
      setIsRecording(true);
      setError(null);
      
      await VideoRecorder.startRecording();
      console.log('Video recording started');
      
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
  }, [isInitialized, initializeCamera, toast]);

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