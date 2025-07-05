import { Button } from '@/components/ui/button';
import { Camera, Video, Square, Play } from 'lucide-react';

interface CameraControlsProps {
  captureMode: 'photo' | 'video';
  isActive: boolean;
  isRecording: boolean;
  onModeChange: (mode: 'photo' | 'video') => void;
  onStartCapture: () => void;
  onCapture: () => void;
}

export const CameraControls = ({
  captureMode,
  isActive,
  isRecording,
  onModeChange,
  onStartCapture,
  onCapture
}: CameraControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={captureMode === 'photo' ? 'authentic' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('photo')}
          className="text-white"
          disabled={isActive}
        >
          <Camera className="w-4 h-4" />
        </Button>
        <Button
          variant={captureMode === 'video' ? 'authentic' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('video')}
          className="text-white"
          disabled={isActive}
        >
          <Video className="w-4 h-4" />
        </Button>
      </div>

      {/* Capture Button */}
      {!isActive ? (
        <Button
          variant="timer"
          size="icon"
          className="w-16 h-16 rounded-full"
          onClick={onStartCapture}
        >
          <Play className="w-8 h-8" />
        </Button>
      ) : (
        <Button
          variant="timer"
          size="icon"
          className="w-16 h-16 rounded-full"
          onClick={onCapture}
        >
          {captureMode === 'video' && isRecording ? (
            <Square className="w-8 h-8" />
          ) : (
            <Camera className="w-8 h-8" />
          )}
        </Button>
      )}

      {/* Placeholder for balance */}
      <div className="w-20"></div>
    </div>
  );
};