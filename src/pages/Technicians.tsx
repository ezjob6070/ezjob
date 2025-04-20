
import { useState } from "react";
import { Technician } from "@/types/technician";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { SortOption } from "@/hooks/useTechniciansData";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechniciansPageHeader from "@/components/technicians/TechniciansPageHeader";
import TechnicianSearchBar from "@/components/technicians/filters/TechnicianSearchBar";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import TechnicianTabs from "@/components/technicians/TechnicianTabs";
import { useTechniciansData } from "@/hooks/useTechniciansData";

const Technicians = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  
  const { technicians: globalTechnicians, addTechnician, updateTechnician } = useGlobalState();
  
  const {
    filteredTechnicians,
    searchQuery,
    selectedTechnicians,
    selectedCategories,
    selectedDepartments = [], // Provide default empty array to avoid undefined
    statusFilter,
    sortOption,
    dateRange,
    categories,
    departments = [], // Provide default empty array to avoid undefined
    handleSearchChange,
    toggleTechnician,
    toggleCategory,
    toggleDepartment,
    handleSortChange,
    setStatusFilter,
    setDateRange,
    addCategory,
    exportTechnicians
  } = useTechniciansData();

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setShowEditModal(true);
  };

  const handleUpdateTechnicianForm = (values: TechnicianEditFormValues) => {
    if (!selectedTechnician) return;
    
    const updatedTechnician: Technician = {
      ...selectedTechnician,
      ...values,
      id: selectedTechnician.id,
      paymentRate: Number(values.paymentRate),
      hourlyRate: Number(values.hourlyRate || selectedTechnician.hourlyRate),
      incentiveAmount: values.incentiveAmount ? Number(values.incentiveAmount) : selectedTechnician.incentiveAmount,
      initials: selectedTechnician.initials,
      completedJobs: selectedTechnician.completedJobs,
      cancelledJobs: selectedTechnician.cancelledJobs,
      totalRevenue: selectedTechnician.totalRevenue,
      rating: selectedTechnician.rating,
      // Add support for profile image
      profileImage: values.profileImage || selectedTechnician.profileImage,
      imageUrl: values.profileImage || selectedTechnician.imageUrl,
    };
    
    updateTechnician(updatedTechnician);
  };

  // Check if selectedDepartments is undefined or null, and provide a default value
  const isSalaryDataVisible = !selectedDepartments || selectedDepartments.length === 0 || selectedDepartments.includes("Finance");

  return (
    <div className="space-y-8 py-8">
      {/* Add TechnicianTabs at the top */}
      <TechnicianTabs currentTab="list" />
      
      <TechniciansPageHeader 
        onAddTechnician={() => setShowAddModal(true)}
        exportTechnicians={exportTechnicians}
      />

      <TechnicianStats technicians={globalTechnicians} />
      
      <div className="mb-6">
        <div className="mb-4">
          <TechnicianSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
        
        <TechnicianFilters 
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          addCategory={addCategory}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          technicians={globalTechnicians}
          selectedTechnicians={selectedTechnicians}
          onTechnicianToggle={toggleTechnician}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          date={dateRange}
          setDate={setDateRange}
          departments={departments}
          selectedDepartments={selectedDepartments}
          toggleDepartment={toggleDepartment}
        />
      </div>
      
      <TechniciansList 
        technicians={filteredTechnicians}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
        onEditTechnician={handleEditTechnician}
        showSalaryData={isSalaryDataVisible}
      />
      
      <AddTechnicianModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddTechnician={addTechnician}
      />

      <EditTechnicianModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateTechnician={handleUpdateTechnicianForm}
        technician={selectedTechnician}
      />
    </div>
  );
};

export default Technicians;
