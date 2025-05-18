import React from "react";
import { Technician, TechnicianStatus } from "@/types/technician";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CalendarDays, Mail, Phone, MapPin, Star, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TechnicianHeaderProps {
  technician: Technician;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ technician }) => {
  // Convert status to correct format for comparison
  const normalizedStatus = technician.status === "on_leave" ? "onLeave" : technician.status;
  
  const getStatusBadge = (status: TechnicianStatus) => {
    switch (normalizedStatus) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>;
      case "onLeave":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">On Leave</Badge>;
      case "training":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Training</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={technician.imageUrl || technician.profileImage} alt={technician.name} />
              <AvatarFallback className="text-lg">{technician.initials || technician.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-2 flex flex-col items-center md:items-start">
              {getStatusBadge(technician.status)}
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">{technician.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{technician.name}</h2>
              <p className="text-muted-foreground">{technician.specialty || technician.position || "Technician"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{technician.email}</span>
                </div>
                {technician.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{technician.phone}</span>
                  </div>
                )}
                {technician.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{technician.address}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Hired: {formatDate(technician.hireDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Completed Jobs
                  </span>
                  <span className="font-medium">{technician.completedJobs}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Cancelled Jobs
                  </span>
                  <span className="font-medium">{technician.cancelledJobs}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Total Revenue
                  </span>
                  <span className="font-medium">{formatCurrency(technician.totalRevenue)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {technician.role && (
                <Badge variant="outline" className="bg-blue-50">
                  {technician.role.charAt(0).toUpperCase() + technician.role.slice(1)}
                </Badge>
              )}
              {technician.subRole && (
                <Badge variant="outline" className="bg-purple-50">
                  {technician.subRole}
                </Badge>
              )}
              {technician.department && (
                <Badge variant="outline" className="bg-green-50">
                  {technician.department}
                </Badge>
              )}
              {technician.category && (
                <Badge variant="outline" className="bg-amber-50">
                  {technician.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 md:mt-0">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">View Schedule</Button>
            <Button variant="outline">Performance</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianHeader;
