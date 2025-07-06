import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './loading';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  showLoadingState?: boolean;
  onLoadingComplete?: () => void;
  onImageError?: (error: Error) => void;
}

export const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className,
  containerClassName,
  showLoadingState = true,
  onLoadingComplete,
  onImageError,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    const error = new Error(`Failed to load image: ${src}`);
    onImageError?.(error);
    console.warn('Image failed to load:', src);
  }, [src, currentSrc, fallbackSrc, onImageError]);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {isLoading && showLoadingState && (
        <Skeleton className={cn('absolute inset-0', className)} />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'grayscale',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
};

interface AvatarImageProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarImage = ({
  src,
  alt,
  fallback,
  size = 'md',
  className
}: AvatarImageProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  if (!src) {
    return (
      <div className={cn(
        'bg-gradient-authentic flex items-center justify-center rounded-full text-primary-foreground font-bold',
        sizes[size],
        className
      )}>
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', sizes[size], className)}
      fallbackSrc="/placeholder.svg"
    />
  );
};