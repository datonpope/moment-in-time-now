import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAnalyticsConsent } from "@/hooks/useAnalyticsConsent";

export const AnalyticsConsentBanner = () => {
  const { showBanner, giveConsent, denyConsent } = useAnalyticsConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="border-border bg-background/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Privacy & Analytics</h3>
            <p className="text-xs text-muted-foreground">
              We use analytics to improve your experience. Your data is anonymized and never shared.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={giveConsent}
                className="flex-1"
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={denyConsent}
                className="flex-1"
              >
                Decline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};