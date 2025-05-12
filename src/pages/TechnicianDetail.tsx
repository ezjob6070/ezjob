
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import TechnicianJobHistory from "@/components/technicians/TechnicianJobHistory";
import TechnicianDocumentUpload from "@/components/technicians/TechnicianDocumentUpload";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianHeader from "@/components/technicians/detail/TechnicianHeader";
import TechnicianOverviewTab from "@/components/technicians/detail/TechnicianOverviewTab";
import TechnicianFinancialTab from "@/components/technicians/detail/TechnicianFinancialTab";
import useTechnicianDetail from "@/hooks/technicians/useTechnicianDetail";

const TechnicianDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    technician,
    showEditModal,
    setShowEditModal,
    activeTab,
    setActiveTab,
    filteredTechnicians,
    displayedTechnicians,
    selectedTechnicianNames,
    paymentTypeFilter,
    setPaymentTypeFilter,
    localDateRange,
    setLocalDateRange,
    selectedTechnicianId,
    handleUpdateTechnician,
    toggleTechnician,
    clearFilters,
    applyFilters,
    onTechnicianSelect
  } = useTechnicianDetail(id);

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

  // Ensure all required arrays exist to prevent null/undefined errors
  const technicianWithDefaults = {
    ...technician,
    certifications: technician.certifications || [],
    skills: technician.skills || [],
    jobCategories: technician.jobCategories || []
  };

  return (
    <div className="space-y-6">
      <TechnicianHeader 
        technician={technicianWithDefaults} 
        onEditClick={() => setShowEditModal(true)} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="history">Job History</TabsTrigger>
          <TabsTrigger value="documents">Documents & Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TechnicianOverviewTab 
            technician={technicianWithDefaults}
            onEditClick={() => setShowEditModal(true)} 
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <TechnicianFinancialTab
            technician={technicianWithDefaults}
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
            selectedTechnicianId={selectedTechnicianId}
            onTechnicianSelect={onTechnicianSelect}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TechnicianJobHistory technician={technicianWithDefaults} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <TechnicianDocumentUpload technician={technicianWithDefaults} />
        </TabsContent>
      </Tabs>

      <EditTechnicianModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateTechnician={handleUpdateTechnician}
        technician={technicianWithDefaults}
      />
    </div>
  );
};

export default TechnicianDetail;
