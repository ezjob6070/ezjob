
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

type CancelJobDialogProps = {
  jobId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const CancelJobDialog = ({ jobId, onOpenChange, onConfirm }: CancelJobDialogProps) => {
  return (
    <AlertDialog open={!!jobId} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Job</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this job? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelJobDialog;
