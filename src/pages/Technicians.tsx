
import { useState, useEffect } from "react";
import { Technician, StaffRole } from "@/types/technician";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
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
import { SortOption } from "@/types/sortOptions";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Technicians = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [selectedRole, setSelectedRole] = useState<StaffRole | "all">("all");
  
  const { technicians: globalTechnicians, addTechnician, updateTechnician } = useGlobalState();
  
  const {
    filteredTechnicians,
    searchQuery,
    selectedTechnicians,
    selectedCategories,
    selectedDepartments = [], 
    statusFilter,
    sortOption,
    dateRange,
    categories,
    departments = [], 
    handleSearchChange,
    toggleTechnician,
    toggleCategory,
    toggleDepartment,
    handleSortChange,
    setStatusFilter,
    setDateRange,
    addCategory,
    exportTechnicians,
    setTechnicians
  } = useTechniciansData();
  
  // Sync technicians from GlobalState to local state in useTechniciansData
  useEffect(() => {
    if (globalTechnicians && globalTechnicians.length > 0) {
      // Make sure to use only valid string dates, not Date objects
      const typedTechnicians: Technician[] = globalTechnicians.map(tech => {
        return {
          ...tech,
          // Ensure hireDate is a properly formatted string
          hireDate: typeof tech.hireDate === 'string' ? tech.hireDate : 
                    (tech.hireDate ? new Date(tech.hireDate).toISOString().split('T')[0] : '2023-01-01'),
          // Ensure paymentType is valid
          paymentType: tech.paymentType as "percentage" | "flat" | "hourly" | "salary"
        };
      });
      setTechnicians(typedTechnicians);
    }
  }, [globalTechnicians, setTechnicians]);

  // Apply role filter to filteredTechnicians
  const roleFilteredTechnicians = selectedRole === "all" 
    ? filteredTechnicians
    : filteredTechnicians.filter(tech => tech.role === selectedRole);

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setShowEditModal(true);
  };

  const handleSortChangeAdapted = (option: SortOption) => {
    handleSortChange(option);
  };

  const handleAddNewTechnician = (technicianData: any) => {
    // Ensure the technician has a unique ID and correct types
    const technicianWithId = {
      ...technicianData,
      id: uuidv4(),
      // Ensure date is a string in YYYY-MM-DD format
      hireDate: typeof technicianData.hireDate === 'string' 
        ? technicianData.hireDate 
        : (technicianData.hireDate instanceof Date 
            ? technicianData.hireDate.toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0])
    };
    
    addTechnician(technicianWithId);
    setShowAddModal(false);
  };

  const handleUpdateTechnicianForm = (values: TechnicianEditFormValues) => {
    if (!selectedTechnician) return;
    
    updateTechnician(selectedTechnician.id, {
      ...selectedTechnician,
      ...values,
      paymentRate: Number(values.paymentRate),
      hourlyRate: Number(values.hourlyRate || selectedTechnician.hourlyRate),
      incentiveAmount: values.incentiveAmount ? Number(values.incentiveAmount) : selectedTechnician.incentiveAmount,
      profileImage: values.profileImage || selectedTechnician.profileImage,
      imageUrl: values.profileImage || selectedTechnician.imageUrl,
    });
    
    setShowEditModal(false);
  };

  const handleRoleChange = (role: StaffRole | "all") => {
    setSelectedRole(role);
  };

  const isSalaryDataVisible = !selectedDepartments || selectedDepartments.length === 0 || selectedDepartments.includes("Finance");

  // Get the appropriate title based on selected role
  const getPageTitle = () => {
    switch(selectedRole) {
      case "technician": return "Technicians";
      case "salesman": return "Salesmen";
      default: return "Staff Management";
    }
  };

  return (
    <div className="space-y-8 py-8">
      <TechnicianTabs currentTab="list" />
      
      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedRole(value as StaffRole | "all")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Staff</TabsTrigger>
            <TabsTrigger value="technician">Technicians</TabsTrigger>
            <TabsTrigger value="salesman">Salesmen</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TechniciansPageHeader 
        onAddTechnician={() => setShowAddModal(true)}
        exportTechnicians={exportTechnicians}
        title={getPageTitle()}
      />

      <TechnicianStats technicians={roleFilteredTechnicians} />
      
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
          sortOption={sortOption as any}
          onSortChange={handleSortChangeAdapted}
          date={dateRange}
          setDate={setDateRange}
          departments={departments}
          selectedDepartments={selectedDepartments}
          toggleDepartment={toggleDepartment}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />
      </div>
      
      <TechniciansList 
        technicians={roleFilteredTechnicians}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
        onEditTechnician={handleEditTechnician}
        showSalaryData={isSalaryDataVisible}
      />
      
      <AddTechnicianModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddTechnician={handleAddNewTechnician}
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
