import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface CaptureConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  captureMode: 'photo' | 'video';
}

export const CaptureConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  captureMode
}: CaptureConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-background/95 backdrop-blur-md border border-border/50">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-authentic/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-left text-xl">
              Ready for Your Authentic Moment?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="font-semibold text-destructive mb-2">⚠️ This is your one chance</p>
              <p className="text-sm">
                Once you start capturing, there's no going back. 
                No retakes, no do-overs, no second chances.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <p className="font-medium mb-3 text-foreground">What happens next:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  You'll have exactly 60 seconds to capture your {captureMode}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Once captured, you can only share or discard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  This is your one authentic moment - make it count
                </li>
              </ul>
            </div>
            
            <p className="text-center font-medium text-foreground">
              Are you ready to capture something real?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="flex-1">
            Not Yet
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="flex-1 bg-gradient-authentic hover:shadow-authentic transition-all duration-300"
          >
            I'm Ready - Start Timer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};