import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { VideoRecorder } from '@capacitor-community/video-recorder';
import { useToast } from '@/hooks/use-toast';

interface UseMediaRecordingReturn {
  isRecording: boolean;
  recordVideo: () => Promise<string | null>;
  resetRecording: () => void;
}

export const useMediaRecording = (): UseMediaRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const recordVideo = useCallback(async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Mobile App Required",
        description: "Video recording requires the mobile app. Please download from your app store.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsRecording(true);
      console.log('Starting video recording...');

      await VideoRecorder.initialize();
      await VideoRecorder.startRecording();
      
      // Let it record for up to 60 seconds
      return new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const result = await VideoRecorder.stopRecording();
            console.log('Video recorded:', result);
            resolve(result.videoUrl || null);
          } catch (error) {
            console.error('Stop recording failed:', error);
            resolve(null);
          }
        }, 60000);
      });
      
    } catch (error) {
      console.error('Recording failed:', error);
      
      toast({
        title: "Recording Error",
        description: "Failed to record video. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsRecording(false);
    }
  }, [toast]);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    recordVideo,
    resetRecording
  };
};