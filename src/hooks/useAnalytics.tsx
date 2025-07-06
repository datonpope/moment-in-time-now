import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const useAnalytics = () => {
  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID
    
    // Load gtag script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
  }, [location]);

  const trackEvent = (event: AnalyticsEvent) => {
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  };

  const trackUserAction = (action: string, details?: Record<string, any>) => {
    trackEvent({
      action,
      category: 'User Interaction',
      label: JSON.stringify(details)
    });
  };

  const trackMomentCreated = (captureTime: number, hasMedia: boolean) => {
    trackEvent({
      action: 'moment_created',
      category: 'Engagement',
      label: hasMedia ? 'with_media' : 'text_only',
      value: captureTime
    });
  };

  const trackBlueskyConnection = (success: boolean) => {
    trackEvent({
      action: 'bluesky_connection',
      category: 'Integration',
      label: success ? 'success' : 'failure'
    });
  };

  const trackAuthentication = (method: string, success: boolean) => {
    trackEvent({
      action: 'authentication',
      category: 'User',
      label: `${method}_${success ? 'success' : 'failure'}`
    });
  };

  return {
    trackEvent,
    trackUserAction,
    trackMomentCreated,
    trackBlueskyConnection,
    trackAuthentication
  };
};