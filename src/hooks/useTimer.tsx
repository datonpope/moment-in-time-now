import { useState, useEffect, useCallback } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  getTimerColor: () => string;
  formatTime: (seconds: number) => string;
}

export const useTimer = (initialTime: number = 60, onTimeout?: () => void): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onTimeout?.();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const startTimer = useCallback(() => {
    setIsActive(true);
    setTimeLeft(initialTime);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(false);
  }, [initialTime]);

  const getTimerColor = useCallback(() => {
    if (timeLeft <= 10) return 'text-timer-critical';
    if (timeLeft <= 30) return 'text-timer-warning';
    return 'text-timer';
  }, [timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
    getTimerColor,
    formatTime
  };
};