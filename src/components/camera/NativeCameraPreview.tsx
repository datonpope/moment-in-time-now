
import { Camera } from 'lucide-react';

interface NativeCameraPreviewProps {
  facingMode: 'user' | 'environment';
}

export const NativeCameraPreview = ({ facingMode }: NativeCameraPreviewProps) => {
  return (
    <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      <div className="text-white/50 text-center z-10 flex flex-col items-center justify-center h-full">
        <Camera className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm">Native Camera Ready</p>
        <p className="text-xs mt-1 opacity-70">
          {facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
        </p>
      </div>
      
      {/* Corner indicators */}
      <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/30"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/30"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/30"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/30"></div>
    </div>
  );
};
