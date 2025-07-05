import { useState, useRef, useCallback } from 'react';

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
  startVideoRecording: (stream: MediaStream) => void;
  stopVideoRecording: () => void;
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

  const startVideoRecording = useCallback((stream: MediaStream) => {
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
  }, []);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  }, [mediaRecorder, isRecording]);

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
    startVideoRecording,
    stopVideoRecording,
    resetCapture
  };
};