import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { User, Phone, Mail, MapPin, FileText, Building, Calendar, Star, Briefcase, DollarSign, Clock, ChevronLeft } from "lucide-react";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianDocumentUpload from "@/components/technicians/TechnicianDocumentUpload";
import TechnicianJobHistory from "@/components/technicians/TechnicianJobHistory";

const TechnicianDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundTechnician = initialTechnicians.find(tech => tech.id === id);
    if (foundTechnician) {
      setTechnician(foundTechnician);
    } else {
      toast({
        title: "Technician not found",
        description: "The technician you're looking for doesn't exist",
        variant: "destructive"
      });
      navigate("/technicians");
    }
  }, [id, navigate, toast]);

  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    setTechnician(updatedTechnician);
    
    toast({
      title: "Technician Updated",
      description: `${updatedTechnician.name}'s information has been updated.`,
    });
  };

  if (!technician) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading technician details...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/technicians">Technicians</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{technician.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/technicians")}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Technicians
          </Button>
          
          <Button onClick={() => setShowEditModal(true)}>
            Edit Technician
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-2">
                  {technician.imageUrl && <AvatarImage src={technician.imageUrl} alt={technician.name} />}
                  <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
                    {technician.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{technician.name}</h1>
                  <p className="text-muted-foreground">{technician.specialty}</p>
                  <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs ${
                    technician.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
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
                  {technician.category && (
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Category: {technician.category}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Completed Jobs: {technician.completedJobs}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Total Revenue: ${technician.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Rating: {technician.rating}/5</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Payment: {technician.paymentType === "percentage" 
                      ? `${technician.paymentRate}% of job revenue` 
                      : `$${technician.paymentRate} flat rate`}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="job-history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="job-history">Job History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Job History</CardTitle>
              </CardHeader>
              <CardContent>
                <TechnicianJobHistory technician={technician} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <TechnicianDocumentUpload technician={technician} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md">
                  {technician.notes ? (
                    <p className="whitespace-pre-line">{technician.notes}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No notes have been added yet.</p>
                  )}
                </div>
                <Button variant="outline" className="mt-4" onClick={() => setShowEditModal(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {technician && (
        <EditTechnicianModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onUpdateTechnician={handleUpdateTechnician}
          technician={technician}
        />
      )}
    </div>
  );
};

export default TechnicianDetail;
