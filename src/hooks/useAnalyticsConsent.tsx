import { useState, useEffect } from 'react';

export const useAnalyticsConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (consent !== null) {
      setHasConsent(consent === 'true');
    } else {
      setShowBanner(true);
    }
  }, []);

  const giveConsent = () => {
    localStorage.setItem('analytics-consent', 'true');
    setHasConsent(true);
    setShowBanner(false);
  };

  const denyConsent = () => {
    localStorage.setItem('analytics-consent', 'false');
    setHasConsent(false);
    setShowBanner(false);
  };

  return {
    hasConsent,
    showBanner,
    giveConsent,
    denyConsent,
  };
};