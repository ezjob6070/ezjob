
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Estimate, EstimateStatus } from "@/types/estimate";
import { format, differenceInDays } from "date-fns";
import EstimateStatusBadge from "./EstimateStatusBadge";
import EstimateClientInfo from "./EstimateClientInfo";
import EstimateImageGallery from "./EstimateImageGallery";
import EstimateFinancialDetails from "./EstimateFinancialDetails";
import EstimateDetailDialog from "./EstimateDetailDialog";
import { Clock, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Calculate days until expiration
  const daysUntilExpiration = differenceInDays(
    estimate.expiresAt instanceof Date ? estimate.expiresAt : new Date(estimate.expiresAt),
    new Date()
  );

  // Determine if estimate is expiring soon (within 7 days)
  const isExpiringSoon = daysUntilExpiration > 0 && daysUntilExpiration <= 7;
  
  // Determine if estimate is expired
  const isExpired = daysUntilExpiration <= 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 bg-muted/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{estimate.jobTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">{estimate.clientName}</p>
          </div>
          <EstimateStatusBadge status={estimate.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-4">
        <div className="text-sm space-y-3">
          <EstimateClientInfo 
            email={estimate.clientEmail} 
            phone={estimate.clientPhone} 
          />
          
          <div className="mt-3 flex flex-col gap-1">
            <div className="font-medium text-base">Amount: {formatCurrency(estimate.amount)}</div>
            
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={14} />
                <span>Created: {format(
                  estimate.createdAt instanceof Date ? estimate.createdAt : new Date(estimate.createdAt), 
                  "MMM d, yyyy"
                )}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={14} />
                <span>Expires: {format(
                  estimate.expiresAt instanceof Date ? estimate.expiresAt : new Date(estimate.expiresAt), 
                  "MMM d, yyyy"
                )}</span>
                {isExpiringSoon && !isExpired && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 ml-1">
                    Expires soon
                  </Badge>
                )}
                {isExpired && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 ml-1">
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center gap-1 mb-1">
              <FileText size={14} />
              <div className="font-medium">Description</div>
            </div>
            <p className="text-muted-foreground line-clamp-2">{estimate.description}</p>
          </div>
          
          <EstimateImageGallery images={estimate.images} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 pt-3">
        <div className="text-xs text-muted-foreground">
          {estimate.items.length} {estimate.items.length === 1 ? 'item' : 'items'}
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
