import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, Plus } from 'lucide-react';

const CameraInterface = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    setTimeLeft(60);
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-timer-critical';
    if (timeLeft <= 30) return 'text-timer-warning';
    return 'text-timer';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Experience the 60-Second Challenge</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how it feels to capture authentic moments under pressure. No time to overthink, just pure authenticity.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Mock Camera Interface */}
          <div className="bg-black rounded-3xl p-6 shadow-authentic">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold ${getTimerColor()} transition-colors duration-300`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-white/70 text-sm mt-2">
                {isActive ? 'Capture your authentic moment!' : 'Tap start to begin'}
              </p>
            </div>

            {/* Mock Camera Viewfinder */}
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              <div className="text-white/50 text-center z-10">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Camera Preview</p>
              </div>
              
              {/* Corner indicators */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/30"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/30"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/30"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/30"></div>
            </div>

            {/* Capture Controls */}
            <div className="flex items-center justify-between">
              {/* Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={captureMode === 'photo' ? 'authentic' : 'ghost'}
                  size="sm"
                  onClick={() => setCaptureMode('photo')}
                  className="text-white"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Button
                  variant={captureMode === 'video' ? 'authentic' : 'ghost'}
                  size="sm"
                  onClick={() => setCaptureMode('video')}
                  className="text-white"
                >
                  <Video className="w-4 h-4" />
                </Button>
              </div>

              {/* Capture Button */}
              <Button
                variant="timer"
                size="icon"
                className="w-16 h-16 rounded-full"
                onClick={startTimer}
                disabled={isActive}
              >
                <Plus className="w-8 h-8" />
              </Button>

              {/* Placeholder for balance */}
              <div className="w-20"></div>
            </div>

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
          </div>

          {/* Demo Info */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>This is a demo interface. The real app opens directly to camera.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CameraInterface;