
import { useState, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface UseCaptureReturn {
  isRecording: boolean;
  captureMode: 'photo' | 'video';
  capturedMedia: File | null;
  capturedUrl: string | null;
  mediaRecorder: MediaRecorder | null;
  setVideoRef: (ref: HTMLVideoElement | null) => void;
  setCanvasRef: (ref: HTMLCanvasElement | null) => void;
  setCaptureMode: (mode: 'photo' | 'video') => void;
  capturePhoto: () => Promise<void>;
  captureNativePhoto: (dataUrl: string) => Promise<void>;
  startVideoRecording: (stream?: MediaStream) => Promise<void>;
  stopVideoRecording: () => Promise<void>;
  resetCapture: () => void;
}

export const useCapture = (): UseCaptureReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isNative = Capacitor.isNativePlatform();

  const setVideoRef = useCallback((ref: HTMLVideoElement | null) => {
    videoRef.current = ref;
  }, []);

  const setCanvasRef = useCallback((ref: HTMLCanvasElement | null) => {
    canvasRef.current = ref;
  }, []);

  const capturePhoto = useCallback(async () => {
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
  }, []);

  const captureNativePhoto = useCallback(async (dataUrl: string) => {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setCapturedMedia(file);
      setCapturedUrl(dataUrl);
    } catch (error) {
      console.error('Error processing native photo:', error);
    }
  }, []);

  const startVideoRecording = useCallback(async (stream?: MediaStream) => {
    if (isNative) {
      // Use native camera for video recording on mobile
      try {
        console.log('Starting native video recording using Camera plugin...');
        
        const video = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

        if (video.webPath) {
          // Convert the video URI to a File object
          const response = await fetch(video.webPath);
          const blob = await response.blob();
          const file = new File([blob], `video-${Date.now()}.mp4`, { type: 'video/mp4' });
          setCapturedMedia(file);
          setCapturedUrl(video.webPath);
        }
        
        setIsRecording(false);
        console.log('Native video recording completed successfully');
      } catch (error) {
        console.error('Native video recording failed:', error);
        setIsRecording(false);
        throw error;
      }
    } else {
      // Use web MediaRecorder for desktop
      if (!stream) {
        console.error('No stream provided for web video recording');
        return;
      }

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
      console.log('Web video recording started successfully');
    }
  }, [isNative]);

  const stopVideoRecording = useCallback(async () => {
    if (isNative) {
      // For native, the recording is handled in startVideoRecording
      // This method is called but doesn't need to do anything
      console.log('Native video recording - stop called but recording already completed');
    } else {
      // Stop web MediaRecorder
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        console.log('Web video recording stopped');
      }
    }
  }, [isNative, mediaRecorder, isRecording]);

  const resetCapture = useCallback(() => {
    setCapturedMedia(null);
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
    }
    setCapturedUrl(null);
  }, [capturedUrl]);

  return {
    isRecording,
    captureMode,
    capturedMedia,
    capturedUrl,
    mediaRecorder,
    setVideoRef,
    setCanvasRef,
    setCaptureMode,
    capturePhoto,
    captureNativePhoto,
    startVideoRecording,
    stopVideoRecording,
    resetCapture
  };
};
