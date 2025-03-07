
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Estimate, EstimateStatus } from "@/types/estimate";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import EstimateClientInfo from "./EstimateClientInfo";
import EstimateImageGallery from "./EstimateImageGallery";
import EstimateFinancialDetails from "./EstimateFinancialDetails";

interface EstimateDetailDialogProps {
  estimate: Estimate;
  onStatusChange: (id: string, status: EstimateStatus) => void;
  onSendEmail: () => void;
}

const EstimateDetailDialog = ({ estimate, onStatusChange, onSendEmail }: EstimateDetailDialogProps) => {
  const handleStatusChange = (status: EstimateStatus) => {
    onStatusChange(estimate.id, status);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{estimate.jobTitle}</DialogTitle>
          <DialogDescription>
            View and update the estimate for {estimate.clientName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="font-medium">Client Information</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Name</div>
                <div>{estimate.clientName}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Email</div>
                <div>{estimate.clientEmail}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Phone</div>
                <div>{estimate.clientPhone}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Address</div>
                <div>{estimate.clientAddress}</div>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="font-medium">Job Details</div>
            <div>
              <div className="text-muted-foreground">Description</div>
              <div>{estimate.description}</div>
            </div>
            {estimate.images.length > 0 && (
              <EstimateImageGallery 
                images={estimate.images} 
                smallPreview={false} 
                maxPreview={estimate.images.length} 
              />
            )}
          </div>
          <EstimateFinancialDetails 
            price={estimate.price} 
            tax={estimate.tax} 
            detailed={true} 
          />
          <div className="grid gap-2">
            <div className="font-medium">Status</div>
            <Select
              value={estimate.status}
              onValueChange={(value) => handleStatusChange(value as EstimateStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="in-process">In Process</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onSendEmail}>
            Send Email
          </Button>
          <Button size="sm">
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstimateDetailDialog;
