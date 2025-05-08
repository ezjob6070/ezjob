
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Phone, AtSign, MapPin, Calendar, Pencil } from "lucide-react";
import { Technician } from "@/types/technician";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import JobsRevenueComparison from "@/components/technicians/JobsRevenueComparison";
import TechnicianInvoiceGenerator from "@/components/technicians/invoices/TechnicianInvoiceGenerator";
import { Button } from "@/components/ui/button";

interface TechnicianOverviewTabProps {
  technician: Technician;
  onEditClick: () => void;
}

const TechnicianOverviewTab: React.FC<TechnicianOverviewTabProps> = ({ technician, onEditClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const metrics = {
    completedJobs: technician.completedJobs,
    cancelledJobs: technician.cancelledJobs,
    totalRevenue: technician.totalRevenue,
    rating: technician.rating
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Technician Details</CardTitle>
          <Button variant="outline" size="sm" onClick={onEditClick}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{technician.specialty}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{technician.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <AtSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{technician.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{technician.address || 'No address provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Hired: {formatDate(technician.hireDate)}</span>
          </div>
          
          {/* Invoice buttons bar */}
          <div className="mt-6 pt-4 border-t">
            <TechnicianInvoiceGenerator 
              technicians={[technician]} 
              selectedTechnician={technician}
            />
          </div>
        </CardContent>
      </Card>

      <TechnicianDetailCard 
        technician={technician} 
        metrics={metrics}
        dateRangeText="Current Period" 
      />

      <JobsRevenueComparison technicians={[technician]} />
    </div>
  );
};

export default TechnicianOverviewTab;
