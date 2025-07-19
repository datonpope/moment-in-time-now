
import { Card } from '@/components/ui/card';
import { CameraPreview } from '@/components/camera/CameraPreview';
import { NativeCameraPreview } from '@/components/camera/NativeCameraPreview';
import { CameraControls } from '@/components/camera/CameraControls';
import { CaptureConfirmationDialog } from '@/components/CaptureConfirmationDialog';

interface CameraInterfaceProps {
  stream: MediaStream | null;
  timeLeft: number;
  isActive: boolean;
  isRecording: boolean;
  captureMode: 'photo' | 'video';
  facingMode: 'user' | 'environment';
  isNative: boolean;
  showConfirmDialog: boolean;
  getTimerColor: () => string;
  formatTime: (seconds: number) => string;
  onVideoRef: (ref: HTMLVideoElement | null) => void;
  onCanvasRef: (ref: HTMLCanvasElement | null) => void;
  onModeChange: (mode: 'photo' | 'video') => void;
  onStartCapture: () => void;
  onCapture: () => void;
  onToggleCamera: () => void;
  onConfirmDialogChange: (open: boolean) => void;
  onConfirmCapture: () => void;
}

export const CameraInterface = ({
  stream,
  timeLeft,
  isActive,
  isRecording,
  captureMode,
  facingMode,
  isNative,
  showConfirmDialog,
  getTimerColor,
  formatTime,
  onVideoRef,
  onCanvasRef,
  onModeChange,
  onStartCapture,
  onCapture,
  onToggleCamera,
  onConfirmDialogChange,
  onConfirmCapture
}: CameraInterfaceProps) => {
  return (
    <div className="min-h-screen bg-card p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-black p-6 shadow-authentic">
          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getTimerColor()} transition-colors duration-300`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-white/70 text-sm mt-2">
              {isActive ? 'No retakes - make it count!' : 'One chance. One authentic moment.'}
            </p>
          </div>

          {/* Camera Viewfinder */}
          {isNative && captureMode === 'photo' ? (
            <NativeCameraPreview facingMode={facingMode} />
          ) : (
            <CameraPreview
              stream={stream}
              onVideoRef={onVideoRef}
              onCanvasRef={onCanvasRef}
            />
          )}

          {/* Controls */}
          <CameraControls
            captureMode={captureMode}
            isActive={isActive}
            isRecording={isRecording}
            facingMode={facingMode}
            onModeChange={onModeChange}
            onStartCapture={onStartCapture}
            onCapture={onCapture}
            onToggleCamera={onToggleCamera}
          />

          {/* Progress Bar */}
          {isActive && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-timer h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>One authentic moment. No retakes. No filters. No excuses.</p>
          <p className="mt-1">60 seconds to capture something real.</p>
          {isNative && (
            <p className="mt-1 text-xs text-primary">Native camera mode active</p>
          )}
        </div>

        {/* Confirmation Dialog */}
        <CaptureConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={onConfirmDialogChange}
          onConfirm={onConfirmCapture}
          captureMode={captureMode}
        />
      </div>
    </div>
  );
};
