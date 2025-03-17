
import { useState } from "react";
import { Technician } from "@/types/technician";
import useTechniciansData from "@/hooks/useTechniciansData";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import TechniciansPageHeader from "@/components/technicians/TechniciansPageHeader";

const Technicians = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  
  const {
    technicians,
    filteredTechnicians,
    searchQuery,
    selectedTechnicians,
    selectedCategories,
    selectedDepartments,
    statusFilter,
    sortOption,
    dateRange,
    categories,
    departments,
    handleAddTechnician,
    handleUpdateTechnician,
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
      rating: selectedTechnician.rating
    };
    
    handleUpdateTechnician(updatedTechnician);
  };

  return (
    <div className="space-y-8 py-8">
      <TechniciansPageHeader 
        onAddTechnician={() => setShowAddModal(true)}
        exportTechnicians={exportTechnicians}
      />

      <TechnicianStats technicians={technicians} />
      
      <div className="mb-6">
        <TechnicianFilters 
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          addCategory={addCategory}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          technicians={technicians}
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
      
      <TechnicianCircleCharts filteredTechnicians={filteredTechnicians} dateRange={dateRange} />
      
      <TechniciansList 
        technicians={filteredTechnicians}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
        onEditTechnician={handleEditTechnician}
        showSalaryData={selectedDepartments.includes("Finance") || selectedDepartments.length === 0}
      />
      
      <AddTechnicianModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddTechnician={handleAddTechnician}
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
