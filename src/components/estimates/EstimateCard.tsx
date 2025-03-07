
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Estimate, EstimateStatus } from "@/types/estimate";
import { format } from "date-fns";
import EstimateStatusBadge from "./EstimateStatusBadge";
import EstimateClientInfo from "./EstimateClientInfo";
import EstimateImageGallery from "./EstimateImageGallery";
import EstimateFinancialDetails from "./EstimateFinancialDetails";
import EstimateDetailDialog from "./EstimateDetailDialog";

interface EstimateCardProps {
  estimate: Estimate;
  onStatusChange: (id: string, status: EstimateStatus) => void;
}

const EstimateCard = ({ estimate, onStatusChange }: EstimateCardProps) => {
  const handleSendEmail = () => {
    // In a real application, this would connect to an email service
    // For now, we'll simulate the email sending with a toast notification
    toast({
      title: "Email Sent",
      description: `Estimate for ${estimate.jobTitle} has been sent to ${estimate.clientEmail}`,
    });
    
    // If the estimate was new, automatically change status to "sent"
    if (estimate.status !== "sent") {
      onStatusChange(estimate.id, "sent");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{estimate.jobTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">{estimate.clientName}</p>
          </div>
          <EstimateStatusBadge status={estimate.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <EstimateClientInfo 
            email={estimate.clientEmail} 
            phone={estimate.clientPhone} 
          />
          <div className="mt-4">
            <div className="font-medium">Description</div>
            <p className="text-muted-foreground">{estimate.description}</p>
          </div>
          <EstimateImageGallery images={estimate.images} />
          <EstimateFinancialDetails 
            price={estimate.price} 
            tax={estimate.tax} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          Created: {format(estimate.createdAt, "MMM d, yyyy")}
        </div>
        <EstimateDetailDialog 
          estimate={estimate} 
          onStatusChange={onStatusChange}
          onSendEmail={handleSendEmail} 
        />
      </CardFooter>
    </Card>
  );
};

export default EstimateCard;
