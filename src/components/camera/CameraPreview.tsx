import { useRef, useEffect } from 'react';

interface CameraPreviewProps {
  stream: MediaStream | null;
  onVideoRef: (ref: HTMLVideoElement | null) => void;
  onCanvasRef: (ref: HTMLCanvasElement | null) => void;
}

export const CameraPreview = ({ stream, onVideoRef, onCanvasRef }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      onVideoRef(videoRef.current);
    }
    if (canvasRef.current) {
      onCanvasRef(canvasRef.current);
    }
  }, [onVideoRef, onCanvasRef]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
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
  );
};