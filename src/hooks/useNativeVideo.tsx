
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { useToast } from '@/hooks/use-toast';

interface UseNativeVideoReturn {
  isRecording: boolean;
  openNativeVideoCamera: () => Promise<void>;
  resetRecording: () => void;
}

export const useNativeVideo = (): UseNativeVideoReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const openNativeVideoCamera = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Mobile App Required",
        description: "Video recording requires the mobile app. Please download from your app store.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRecording(true);
      console.log('Opening native video camera...');

      const info = await Device.getInfo();
      
      if (info.platform === 'android') {
        // Android camera intent for video recording
        const videoIntent = 'intent://photo#Intent;scheme=android.media.action.VIDEO_CAPTURE;package=com.android.camera;end';
        await App.openUrl({ url: videoIntent });
      } else if (info.platform === 'ios') {
        // iOS camera app with video mode (limited control)
        await App.openUrl({ url: 'camera://' });
      }

      // Note: We can't directly capture the result from native camera
      // User will need to return to app and we'll handle the flow there
      console.log('Native video camera opened successfully');
      
    } catch (error) {
      console.error('Failed to open native video camera:', error);
      setIsRecording(false);
      
      toast({
        title: "Camera Error",
        description: "Failed to open native camera. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    openNativeVideoCamera,
    resetRecording
  };
};
