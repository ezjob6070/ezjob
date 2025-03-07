
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { BarChartIcon, BriefcaseIcon, DollarSignIcon, EditIcon, PercentIcon, StarIcon } from "lucide-react";

type TechnicianCardProps = {
  technician: Technician;
  onEdit: (technician: Technician) => void;
};

const TechnicianCard = ({ technician, onEdit }: TechnicianCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {technician.imageUrl ? (
                <AvatarImage src={technician.imageUrl} alt={technician.name} />
              ) : null}
              <AvatarFallback className="bg-blue-600 text-white">
                {technician.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{technician.name}</p>
              <p className="text-sm text-muted-foreground">{technician.specialty}</p>
            </div>
          </div>
          <Badge variant={technician.status === "active" ? "success" : "outline"}>
            {technician.status}
          </Badge>
        </div>

        <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Jobs</p>
              <p className="font-medium">{technician.completedJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="font-medium">{formatCurrency(technician.totalRevenue)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarIcon className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="font-medium">{technician.rating.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {technician.paymentType === "percentage" ? (
              <PercentIcon className="h-4 w-4 text-blue-600" />
            ) : (
              <DollarSignIcon className="h-4 w-4 text-green-600" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="font-medium">
                {technician.paymentType === "percentage" 
                  ? `${technician.paymentRate}%` 
                  : `$${technician.paymentRate}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0"
            onClick={() => onEdit(technician)}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianCard;
