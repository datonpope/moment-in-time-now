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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-left">
              Ready for Your Authentic Moment?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              <strong>Important:</strong> Once you start capturing, there's no going back. 
              No retakes, no do-overs, no second chances.
            </p>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">What happens next:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• You'll have 60 seconds to capture your {captureMode}</li>
                <li>• Once captured, you can only share or discard</li>
                <li>• This is your one authentic moment - make it count</li>
              </ul>
            </div>
            <p className="text-sm font-medium">
              Are you ready to capture something real?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not Yet</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-primary">
            I'm Ready - Start Timer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};