import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Validation rules
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters with letters and numbers'
  },
  displayName: {
    pattern: /^[a-zA-Z0-9\s]{2,30}$/,
    message: 'Display name must be 2-30 characters (letters, numbers, spaces only)'
  },
  url: {
    pattern: /^https?:\/\/.+\..+/,
    message: 'Please enter a valid URL starting with http:// or https://'
  },
  blueskyHandle: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.bsky\.social$/,
    message: 'Please enter a valid Bluesky handle (e.g., username.bsky.social)'
  }
};

// Validation functions
export const validateField = (value: string, rule: keyof typeof validationRules) => {
  if (!value.trim()) return { isValid: false, message: 'This field is required' };
  
  const { pattern, message } = validationRules[rule];
  const isValid = pattern.test(value.trim());
  
  return {
    isValid,
    message: isValid ? '' : message
  };
};

export const validateRequired = (value: string, fieldName: string = 'This field') => {
  const trimmed = value.trim();
  return {
    isValid: trimmed.length > 0,
    message: trimmed.length > 0 ? '' : `${fieldName} is required`
  };
};

export const validateLength = (value: string, min: number, max: number, fieldName: string = 'This field') => {
  const length = value.trim().length;
  if (length < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min} characters`
    };
  }
  if (length > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max} characters`
    };
  }
  return {
    isValid: true,
    message: ''
  };
};

// Validation feedback component
interface ValidationFeedbackProps {
  isValid?: boolean;
  message: string;
  className?: string;
}

export const ValidationFeedback = ({ isValid, message, className }: ValidationFeedbackProps) => {
  if (!message) return null;

  return (
    <div className={cn(
      'flex items-center gap-1 text-xs mt-1',
      isValid ? 'text-secondary' : 'text-destructive',
      className
    )}>
      {isValid ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      <span>{message}</span>
    </div>
  );
};

// Real-time validation hook
export const useFieldValidation = (initialValue: string = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  const [isTouched, setIsTouched] = React.useState(false);

  const validate = React.useCallback((newValue: string, rule?: keyof typeof validationRules) => {
    if (rule) {
      const result = validateField(newValue, rule);
      setError(result.message);
      setIsValid(result.isValid);
      return result;
    }
    return { isValid: true, message: '' };
  }, []);

  const handleChange = (newValue: string, rule?: keyof typeof validationRules) => {
    setValue(newValue);
    if (isTouched) {
      validate(newValue, rule);
    }
  };

  const handleBlur = (rule?: keyof typeof validationRules) => {
    setIsTouched(true);
    validate(value, rule);
  };

  const reset = () => {
    setValue(initialValue);
    setError('');
    setIsValid(true);
    setIsTouched(false);
  };

  return {
    value,
    error,
    isValid,
    isTouched,
    setValue: handleChange,
    onBlur: handleBlur,
    validate,
    reset
  };
};