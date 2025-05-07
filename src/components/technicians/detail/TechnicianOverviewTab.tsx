
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Phone, AtSign, MapPin, Calendar, Shield, CreditCard, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Technician } from "@/types/technician";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import JobsRevenueComparison from "@/components/technicians/JobsRevenueComparison";
import TechnicianInvoiceGenerator from "@/components/technicians/invoices/TechnicianInvoiceGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TechnicianOverviewTabProps {
  technician: Technician;
}

const TechnicianOverviewTab: React.FC<TechnicianOverviewTabProps> = ({ technician }) => {
  const { toast } = useToast();
  const [showSSN, setShowSSN] = useState(false);
  const [showDriverLicense, setShowDriverLicense] = useState(false);
  const [showIDNumber, setShowIDNumber] = useState(false);

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

  // Helper function to mask sensitive data
  const maskData = (data: string | undefined, showFull: boolean) => {
    if (!data) return "Not provided";
    if (showFull) return data;
    return data.substring(0, 3) + "•".repeat(data.length - 3);
  };

  // Toggle visibility and show toast notification for security awareness
  const toggleSensitiveData = (dataType: 'ssn' | 'license' | 'id') => {
    if (dataType === 'ssn') {
      setShowSSN(!showSSN);
      if (!showSSN) {
        toast({
          title: "Sensitive Data Revealed",
          description: "Social Security Number is now visible. Remember to protect this information.",
          variant: "destructive",
        });
      }
    } else if (dataType === 'license') {
      setShowDriverLicense(!showDriverLicense);
      if (!showDriverLicense) {
        toast({
          title: "Sensitive Data Revealed",
          description: "Driver's License information is now visible. Remember to protect this information.",
          variant: "destructive",
        });
      }
    } else if (dataType === 'id') {
      setShowIDNumber(!showIDNumber);
      if (!showIDNumber) {
        toast({
          title: "Sensitive Data Revealed",
          description: "ID information is now visible. Remember to protect this information.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Technician Details</CardTitle>
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
          
          {/* Sensitive Information Section */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-semibold flex items-center mb-3">
              <Shield className="h-4 w-4 mr-2 text-amber-500" />
              Sensitive Information
            </h3>
            
            {/* Social Security Number */}
            <div className="bg-amber-50 p-3 rounded-md mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center">
                  <CreditCard className="h-3 w-3 mr-1 text-amber-600" />
                  Social Security Number
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleSensitiveData('ssn')}
                >
                  {showSSN ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm font-mono bg-white p-1 rounded border">
                {maskData(technician.ssn, showSSN)}
              </p>
            </div>
            
            {/* Driver's License */}
            <div className="bg-amber-50 p-3 rounded-md mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center">
                  <CreditCard className="h-3 w-3 mr-1 text-amber-600" />
                  Driver's License
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleSensitiveData('license')}
                >
                  {showDriverLicense ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {technician.driverLicense ? (
                <div className="text-sm space-y-1">
                  <p className="font-mono bg-white p-1 rounded border">
                    Number: {maskData(technician.driverLicense.number, showDriverLicense)}
                  </p>
                  <p className="font-mono bg-white p-1 rounded border">
                    State: {technician.driverLicense.state}
                  </p>
                  <p className="font-mono bg-white p-1 rounded border">
                    Expires: {showDriverLicense ? technician.driverLicense.expirationDate : "••/••/••••"}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-mono bg-white p-1 rounded border">Not provided</p>
              )}
            </div>
            
            {/* ID Number */}
            <div className="bg-amber-50 p-3 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center">
                  <CreditCard className="h-3 w-3 mr-1 text-amber-600" />
                  ID Number
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleSensitiveData('id')}
                >
                  {showIDNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm font-mono bg-white p-1 rounded border">
                {maskData(technician.idNumber, showIDNumber)}
              </p>
            </div>
            
            <div className="flex items-center text-xs text-amber-700 mt-3">
              <AlertCircle className="h-3 w-3 mr-1" />
              This information is sensitive. Please handle with care.
            </div>
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
