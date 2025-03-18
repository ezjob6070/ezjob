import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Users, Phone, AtSign, MapPin, Calendar, AlertCircle } from "lucide-react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianJobHistory from "@/components/technicians/TechnicianJobHistory";
import TechnicianDocumentUpload from "@/components/technicians/TechnicianDocumentUpload";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import JobsRevenueComparison from "@/components/technicians/JobsRevenueComparison";
import { calculateFinancialMetrics } from "@/hooks/technicians/financialUtils";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";

const TechnicianDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [displayedTechnicians, setDisplayedTechnicians] = useState<Technician[]>([]);
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [localDateRange, setLocalDateRange] = useState<any>(undefined);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const techData = initialTechnicians.find(tech => tech.id === id);
    if (techData) {
      setTechnician(techData);
      setFilteredTechnicians([techData]);
      setDisplayedTechnicians([techData]);
      setSelectedTechnicianId(techData.id);
    } else {
      toast({
        title: "Error",
        description: "Technician not found",
        variant: "destructive",
      });
      navigate("/technicians");
    }
  }, [id, navigate, toast]);

  const handleUpdateTechnician = (values: TechnicianEditFormValues) => {
    if (!technician) return;
    
    const updatedTechnician: Technician = {
      ...technician,
      ...values,
      id: technician.id,
      paymentRate: Number(values.paymentRate),
      hourlyRate: Number(values.hourlyRate || technician.hourlyRate),
      incentiveAmount: values.incentiveAmount ? Number(values.incentiveAmount) : technician.incentiveAmount,
      initials: technician.initials,
      completedJobs: technician.completedJobs,
      cancelledJobs: technician.cancelledJobs,
      totalRevenue: technician.totalRevenue,
      rating: technician.rating,
      profileImage: values.profileImage || technician.profileImage,
      imageUrl: values.profileImage || technician.imageUrl,
      notes: values.notes || technician.notes,
    };
    
    setTechnician(updatedTechnician);
    setFilteredTechnicians([updatedTechnician]);
    setDisplayedTechnicians([updatedTechnician]);
    
    toast({
      title: "Success",
      description: "Technician updated successfully",
    });
  };

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicianNames(prev => 
      prev.includes(techName) ? prev.filter(name => name !== techName) : [...prev, techName]
    );
  };
  
  const clearFilters = () => {
    setSelectedTechnicianNames([]);
  };
  
  const applyFilters = () => {
    console.log("Applying filters");
  };
  
  const onTechnicianSelect = (tech: Technician) => {
    setSelectedTechnicianId(tech.id);
  };

  if (!technician) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">Loading technician data...</h3>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'onLeave':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const metrics = {
    completedJobs: technician.completedJobs,
    cancelledJobs: technician.cancelledJobs,
    totalRevenue: technician.totalRevenue,
    rating: technician.rating
  };
  
  const financialMetrics = calculateFinancialMetrics([technician]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/technicians")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{technician.name}</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(technician.status)}`}>
            {technician.status === 'onLeave' ? 'On Leave' : technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
          </span>
        </div>
        <Button onClick={() => setShowEditModal(true)}>
          Edit Technician
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="history">Job History</TabsTrigger>
          <TabsTrigger value="documents">Documents & Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
              </CardContent>
            </Card>

            <TechnicianDetailCard 
              technician={technician} 
              metrics={metrics}
              dateRangeText="Current Period" 
            />

            <JobsRevenueComparison technicians={[technician]} />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <PaymentBreakdownCards 
            revenue={financialMetrics.totalRevenue}
            technicianEarnings={financialMetrics.technicianEarnings}
            expenses={financialMetrics.totalExpenses}
            profit={financialMetrics.companyProfit}
            dateRangeText="All Time"
          />
          <TechnicianFinancialTable 
            filteredTechnicians={filteredTechnicians}
            displayedTechnicians={displayedTechnicians}
            selectedTechnicianNames={selectedTechnicianNames}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            paymentTypeFilter={paymentTypeFilter}
            setPaymentTypeFilter={setPaymentTypeFilter}
            localDateRange={localDateRange}
            setLocalDateRange={setLocalDateRange}
            onTechnicianSelect={onTechnicianSelect}
            selectedTechnicianId={selectedTechnicianId}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TechnicianJobHistory technician={technician} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <TechnicianDocumentUpload technician={technician} />
        </TabsContent>
      </Tabs>

      <EditTechnicianModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateTechnician={handleUpdateTechnician}
        technician={technician}
      />
    </div>
  );
};

export default TechnicianDetail;
