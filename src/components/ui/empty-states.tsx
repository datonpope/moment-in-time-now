import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';
import { 
  Camera, 
  Users, 
  Image, 
  Wifi, 
  AlertCircle,
  Search,
  Plus
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) => {
  return (
    <Card className={cn('p-8 text-center', className)}>
      <div className="flex flex-col items-center space-y-4">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {description}
          </p>
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
};

// Predefined empty states
export const NoMomentsEmpty = ({ onCreateMoment }: { onCreateMoment: () => void }) => (
  <EmptyState
    icon={<Camera className="w-6 h-6 text-muted-foreground" />}
    title="No moments yet"
    description="Capture your first authentic moment! Every photo and video tells a story."
    action={{
      label: "Capture Moment",
      onClick: onCreateMoment
    }}
  />
);

export const NoSearchResultsEmpty = ({ searchTerm, onClearSearch }: { 
  searchTerm: string; 
  onClearSearch: () => void;
}) => (
  <EmptyState
    icon={<Search className="w-6 h-6 text-muted-foreground" />}
    title="No results found"
    description={`We couldn't find any results for "${searchTerm}". Try adjusting your search terms.`}
    action={{
      label: "Clear Search",
      onClick: onClearSearch,
      variant: "outline"
    }}
  />
);

export const NoConnectionEmpty = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    icon={<Wifi className="w-6 h-6 text-destructive" />}
    title="Connection lost"
    description="Unable to load content. Check your internet connection and try again."
    action={{
      label: "Try Again",
      onClick: onRetry,
      variant: "outline"
    }}
  />
);

export const ErrorEmpty = ({ 
  message, 
  onRetry 
}: { 
  message?: string; 
  onRetry: () => void;
}) => (
  <EmptyState
    icon={<AlertCircle className="w-6 h-6 text-destructive" />}
    title="Something went wrong"
    description={message || "An unexpected error occurred. Please try again."}
    action={{
      label: "Retry",
      onClick: onRetry,
      variant: "outline"
    }}
  />
);

export const NoProfileEmpty = ({ onSetupProfile }: { onSetupProfile: () => void }) => (
  <EmptyState
    icon={<Users className="w-6 h-6 text-muted-foreground" />}
    title="Complete your profile"
    description="Add your photo and details to personalize your authentic moments experience."
    action={{
      label: "Setup Profile",
      onClick: onSetupProfile
    }}
  />
);

export const NoMediaEmpty = ({ onUploadMedia }: { onUploadMedia: () => void }) => (
  <EmptyState
    icon={<Image className="w-6 h-6 text-muted-foreground" />}
    title="No media uploaded"
    description="Start sharing your authentic moments by uploading your first photo or video."
    action={{
      label: "Upload Media",
      onClick: onUploadMedia,
      variant: "outline"
    }}
  />
);