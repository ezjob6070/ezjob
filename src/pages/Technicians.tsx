
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechniciansPageHeader from "@/components/technicians/TechniciansPageHeader";
import TechnicianSearchBar from "@/components/technicians/filters/TechnicianSearchBar";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { SortOption } from "@/types/sortOptions";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Wrench, Briefcase, UserCheck, Hammer, UserRound } from "lucide-react";

const Technicians = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  
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
          paymentType: tech.paymentType as "percentage" | "flat" | "hourly" | "salary",
          // Default role if not set
          role: tech.role || "technician",
          // Default initials if not set
          initials: tech.initials || tech.name.split(' ').map(n => n[0]).join('')
        };
      });
      setTechnicians(typedTechnicians);
    }
  }, [globalTechnicians, setTechnicians]);

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
            : new Date().toISOString().split('T')[0]),
      // Default initials if not set
      initials: technicianData.initials || 
        (technicianData.name ? technicianData.name.split(' ').map(n => n[0]).join('') : 'XX')
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

  const isSalaryDataVisible = !selectedDepartments || selectedDepartments.length === 0 || selectedDepartments.includes("Finance");

  // Get staff counts by role
  const technicianCount = globalTechnicians.filter(tech => (tech.role || "technician") === "technician").length;
  const salesmanCount = globalTechnicians.filter(tech => tech.role === "salesman").length;
  const employedCount = globalTechnicians.filter(tech => tech.role === "employed").length;
  const contractorCount = globalTechnicians.filter(tech => tech.role === "contractor").length;
  const femaleCount = globalTechnicians.filter(tech => tech.role === "female").length;
  const totalCount = globalTechnicians.length;

  return (
    <div className="space-y-6 py-8">
      {/* Page Header - Now at the very top */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Team Members
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your technicians, salesmen, contractors and their payment structures
        </p>
      </div>
      
      {/* Role Filter Buttons - Under the header */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <Button
          variant={roleFilter === "all" ? "default" : "outline"}
          onClick={() => setRoleFilter("all")}
          className={`h-24 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center ${roleFilter === "all" ? "bg-[#F1F0FB] border-2 border-[#6E59A5] text-[#6E59A5] hover:bg-[#F1F0FB]/90" : ""}`}
        >
          <div className="rounded-full bg-[#6E59A5]/20 p-2 mb-1">
            <UserCheck className="h-6 w-6 text-[#6E59A5]" />
          </div>
          <div>All Staff</div>
          <div className="text-sm mt-1 font-bold">{totalCount}</div>
        </Button>
        <Button
          variant={roleFilter === "technician" ? "default" : "outline"}
          onClick={() => setRoleFilter("technician")}
          className={`h-24 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center ${roleFilter === "technician" ? "bg-[#E0F2FE] border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#E0F2FE]/90" : ""}`}
        >
          <div className="rounded-full bg-[#0EA5E9]/20 p-2 mb-1">
            <Wrench className="h-6 w-6 text-[#0EA5E9]" />
          </div>
          <div>Technicians</div>
          <div className="text-sm mt-1 font-bold">{technicianCount}</div>
        </Button>
        <Button
          variant={roleFilter === "salesman" ? "default" : "outline"}
          onClick={() => setRoleFilter("salesman")}
          className={`h-24 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center ${roleFilter === "salesman" ? "bg-[#ECFDF5] border-2 border-[#10B981] text-[#10B981] hover:bg-[#ECFDF5]/90" : ""}`}
        >
          <div className="rounded-full bg-[#10B981]/20 p-2 mb-1">
            <Briefcase className="h-6 w-6 text-[#10B981]" />
          </div>
          <div>Salesmen</div>
          <div className="text-sm mt-1 font-bold">{salesmanCount}</div>
        </Button>
        <Button
          variant={roleFilter === "employed" ? "default" : "outline"}
          onClick={() => setRoleFilter("employed")}
          className={`h-24 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center ${roleFilter === "employed" ? "bg-[#F3E8FF] border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3E8FF]/90" : ""}`}
        >
          <div className="rounded-full bg-[#8B5CF6]/20 p-2 mb-1">
            <UserCheck className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>Employed</div>
          <div className="text-sm mt-1 font-bold">{employedCount}</div>
        </Button>
        <Button
          variant={roleFilter === "contractor" ? "default" : "outline"}
          onClick={() => setRoleFilter("contractor")}
          className={`h-24 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center ${roleFilter === "contractor" ? "bg-[#FFEDD5] border-2 border-[#F97316] text-[#F97316] hover:bg-[#FFEDD5]/90" : ""}`}
        >
          <div className="rounded-full bg-[#F97316]/20 p-2 mb-1">
            <Hammer className="h-6 w-6 text-[#F97316]" />
          </div>
          <div>Contractors</div>
          <div className="text-sm mt-1 font-bold">{contractorCount}</div>
        </Button>
        <Button
          variant={roleFilter === "female" ? "default" : "outline"}
          onClick={() => setRoleFilter("female")}
          className={`h-24 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center ${roleFilter === "female" ? "bg-[#FCE7F3] border-2 border-[#EC4899] text-[#EC4899] hover:bg-[#FCE7F3]/90" : ""}`}
        >
          <div className="rounded-full bg-[#EC4899]/20 p-2 mb-1">
            <UserRound className="h-6 w-6 text-[#EC4899]" />
          </div>
          <div>Female</div>
          <div className="text-sm mt-1 font-bold">{femaleCount}</div>
        </Button>
      </div>
      
      {/* Action buttons */}
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
          sortOption={sortOption as any}
          onSortChange={handleSortChangeAdapted}
          date={dateRange}
          setDate={setDateRange}
          departments={departments}
          selectedDepartments={selectedDepartments}
          toggleDepartment={toggleDepartment}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
        />
      </div>
      
      <TechniciansList 
        technicians={filteredTechnicians}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
        onEditTechnician={handleEditTechnician}
        showSalaryData={isSalaryDataVisible}
        displayMode="card"
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
