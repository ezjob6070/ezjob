
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  Star, Edit, Mail, Phone, MapPin, 
  CheckCircle, XCircle 
} from "lucide-react";
import { Technician } from "@/types/technician";
import { getBadgeVariantFromStatus, formatHourlyRate } from "./technicianListUtils";

interface TechniciansCardViewProps {
  technicians: Technician[];
  onEditTechnician?: (technician: Technician) => void;
}

const TechniciansCardView: React.FC<TechniciansCardViewProps> = ({ 
  technicians,
  onEditTechnician
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {technicians.map((technician) => (
        <Card 
          key={technician.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/technicians/${technician.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge
                variant={getBadgeVariantFromStatus(technician.status)}
                className="capitalize"
              >
                {technician.status}
              </Badge>
              {technician.department && (
                <Badge variant="outline">{technician.department}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={technician.imageUrl || ""} alt={technician.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {technician.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{technician.name}</h3>
                <p className="text-sm text-muted-foreground">{technician.specialty || "General"}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                  <span>{technician.rating || "N/A"}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="flex items-center text-sm">
                <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="truncate">{technician.email}</span>
              </div>
              {technician.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{technician.phone}</span>
                </div>
              )}
              {technician.address && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="truncate">{technician.address}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Contract Type</p>
                <p className="text-sm font-medium">{technician.contractType || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Position</p>
                <p className="text-sm font-medium">{technician.position || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Completed Jobs
                </p>
                <p className="text-sm font-medium">{technician.completedJobs || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <XCircle className="h-3 w-3 mr-1 text-red-500" />
                  Cancelled Jobs
                </p>
                <p className="text-sm font-medium">{technician.cancelledJobs || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-sm font-medium">{formatCurrency(technician.totalRevenue || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="text-sm font-medium">
                  {technician.paymentType === "percentage" 
                    ? `${technician.paymentRate}%` 
                    : formatHourlyRate(technician.paymentRate)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/30 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onEditTechnician) onEditTechnician(technician);
              }}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TechniciansCardView;
