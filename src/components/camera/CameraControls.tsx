import { Button } from '@/components/ui/button';
import { Camera, Video, Square, Play, RotateCcw } from 'lucide-react';

interface CameraControlsProps {
  captureMode: 'photo' | 'video';
  isActive: boolean;
  isRecording: boolean;
  facingMode: 'user' | 'environment';
  onModeChange: (mode: 'photo' | 'video') => void;
  onStartCapture: () => void;
  onCapture: () => void;
  onToggleCamera: () => void;
}

export const CameraControls = ({
  captureMode,
  isActive,
  isRecording,
  facingMode,
  onModeChange,
  onStartCapture,
  onCapture,
  onToggleCamera
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

      {/* Camera Flip Button */}
      <div className="flex justify-end w-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCamera}
          className="text-white p-2"
          disabled={isActive}
          title={`Switch to ${facingMode === 'user' ? 'back' : 'front'} camera`}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};