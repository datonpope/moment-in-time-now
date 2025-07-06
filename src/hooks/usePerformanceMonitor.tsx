import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>();
  const mountTime = useRef<number>();

  useEffect(() => {
    // Track mount time
    mountTime.current = Date.now();
    
    return () => {
      // Track unmount and log if component was slow
      if (mountTime.current) {
        const totalTime = Date.now() - mountTime.current;
        if (totalTime > 100) { // Log slow components
          console.warn(`Slow component detected: ${componentName} took ${totalTime}ms`);
        }
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Track render time
    renderStartTime.current = Date.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = Date.now() - renderStartTime.current;
      if (renderTime > 16) { // 60fps threshold
        console.warn(`Slow render detected: ${componentName} took ${renderTime}ms`);
      }
    }
  });

  const logCustomMetric = (metricName: string, value: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} - ${metricName}: ${value}ms`);
    }
  };

  return { logCustomMetric };
};