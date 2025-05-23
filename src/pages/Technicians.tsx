import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import EditRolesModal from "@/components/technicians/EditRolesModal";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechniciansPageHeader from "@/components/technicians/TechniciansPageHeader";
import TechnicianSearchBar from "@/components/technicians/filters/TechnicianSearchBar";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { SortOption } from "@/types/sortOptions";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Wrench, Briefcase, UserCheck, Hammer } from "lucide-react";
import { TechnicianSubRoles, DEFAULT_SUB_ROLES } from "@/types/technician";
import { useToast } from "@/components/ui/use-toast";

const Technicians = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [subRoleFilter, setSubRoleFilter] = useState<string | null>(null);
  const [customRoles, setCustomRoles] = useState<TechnicianSubRoles>(DEFAULT_SUB_ROLES);
  const { toast } = useToast();
  
  const { technicians: globalTechnicians, addTechnician, updateTechnician } = useGlobalState();
  
  const {
    filteredTechnicians,
    searchQuery,
    selectedTechnicians,
    statusFilter,
    sortOption,
    dateRange,
    handleSearchChange,
    toggleTechnician,
    handleSortChange,
    setStatusFilter,
    setDateRange,
    exportTechnicians,
    setTechnicians
  } = useTechniciansData();
  
  // Sync technicians from GlobalState to local state in useTechniciansData
  useEffect(() => {
    if (globalTechnicians && globalTechnicians.length > 0) {
      // Make sure all required properties are present and have correct types
      const typedTechnicians: Technician[] = globalTechnicians.map(tech => {
        // Generate initials from name if not present
        const nameInitials = tech.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        return {
          ...tech,
          // Ensure hireDate is a properly formatted string
          hireDate: typeof tech.hireDate === 'string' ? tech.hireDate : 
                  (tech.hireDate ? new Date(tech.hireDate).toISOString().split('T')[0] : '2023-01-01'),
          // Ensure paymentType is valid
          paymentType: tech.paymentType as "percentage" | "flat" | "hourly" | "salary",
          // Default role if not set
          role: tech.role || "technician",
          // Ensure salaryBasis is a valid SalaryBasis type
          salaryBasis: tech.salaryBasis as "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly",
          // Default initials if not set
          initials: tech.initials || nameInitials,
          // Ensure other required fields have values
          specialty: tech.specialty || '',
          completedJobs: tech.completedJobs || 0,
          cancelledJobs: tech.cancelledJobs || 0,
          totalRevenue: tech.totalRevenue || 0,
          rating: tech.rating || 0,
          hourlyRate: tech.hourlyRate || 0,
          paymentRate: tech.paymentRate || 0
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

  const handleSaveRoles = (updatedRoles: TechnicianSubRoles) => {
    setCustomRoles(updatedRoles);
    // In a real application, you might want to save this to a database or localStorage
    localStorage.setItem('customRoles', JSON.stringify(updatedRoles));
    toast({
      title: "Roles Updated",
      description: "Staff roles have been successfully updated.",
    });
  };

  // Load saved roles from localStorage on initial render
  useEffect(() => {
    const savedRoles = localStorage.getItem('customRoles');
    if (savedRoles) {
      try {
        setCustomRoles(JSON.parse(savedRoles));
      } catch (e) {
        console.error('Failed to parse saved roles:', e);
      }
    }
  }, []);

  const isSalaryDataVisible = true; // Always visible now that departments filter is removed

  // Get staff counts by role
  const technicianCount = globalTechnicians.filter(tech => (tech.role || "technician") === "technician").length;
  const salesmanCount = globalTechnicians.filter(tech => tech.role === "salesman").length;
  const employedCount = globalTechnicians.filter(tech => tech.role === "employed").length;
  const contractorCount = globalTechnicians.filter(tech => tech.role === "contractor").length;
  const totalCount = globalTechnicians.length;

  // Role colors for consistent styling
  const roleColors = {
    all: "#8B7E2F", // Changed to dark yellow to match the All Staff card
    technician: "#0EA5E9",
    salesman: "#10B981",
    employed: "#8B5CF6",
    contractor: "#F97316"
  };

  return (
    <div className="space-y-6 py-8">
      <div className="mb-2">
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Team Members
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your technicians, salesmen, contractors and their payment structures
        </p>
      </div>
      
      {/* Role Filter Buttons - All Staff card now with light yellow background */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Button
          variant={roleFilter === "all" ? "default" : "outline"}
          onClick={() => setRoleFilter("all")}
          className={`h-48 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center
            ${roleFilter === "all" 
              ? "bg-[#FEF7CD] text-[#8B7E2F] hover:bg-[#FEF7CD]/90" 
              : "hover:bg-[#FEF7CD] hover:text-[#8B7E2F] border-[#8B7E2F]/30"}`}
        >
          <UserCheck className={`h-20 w-20 mb-3 ${roleFilter === "all" ? "text-[#8B7E2F]" : "text-[#6E59A5]"}`} />
          <div className="text-base font-medium">All Staff</div>
          <div className={`text-3xl font-bold mt-2 ${roleFilter === "all" ? "text-[#8B7E2F]" : "text-[#6E59A5]"}`}>{totalCount}</div>
        </Button>
        
        <Button
          variant={roleFilter === "technician" ? "default" : "outline"}
          onClick={() => setRoleFilter("technician")}
          className={`h-48 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center
            ${roleFilter === "technician" 
              ? "bg-[#0EA5E9] text-white hover:bg-[#0D96D6]" 
              : "hover:bg-[#E0F2FE] hover:text-[#0EA5E9] border-[#0EA5E9]/30"}`}
        >
          <Wrench className={`h-20 w-20 mb-3 ${roleFilter === "technician" ? "text-white" : "text-[#0EA5E9]"}`} />
          <div className="text-base font-medium">Technicians</div>
          <div className={`text-3xl font-bold mt-2 ${roleFilter === "technician" ? "text-white" : "text-[#0EA5E9]"}`}>{technicianCount}</div>
        </Button>
        
        <Button
          variant={roleFilter === "salesman" ? "default" : "outline"}
          onClick={() => setRoleFilter("salesman")}
          className={`h-48 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center
            ${roleFilter === "salesman" 
              ? "bg-[#10B981] text-white hover:bg-[#0EA874]" 
              : "hover:bg-[#ECFDF5] hover:text-[#10B981] border-[#10B981]/30"}`}
        >
          <Briefcase className={`h-20 w-20 mb-3 ${roleFilter === "salesman" ? "text-white" : "text-[#10B981]"}`} />
          <div className="text-base font-medium">Salesmen</div>
          <div className={`text-3xl font-bold mt-2 ${roleFilter === "salesman" ? "text-white" : "text-[#10B981]"}`}>{salesmanCount}</div>
        </Button>
        
        <Button
          variant={roleFilter === "employed" ? "default" : "outline"}
          onClick={() => setRoleFilter("employed")}
          className={`h-48 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center
            ${roleFilter === "employed" 
              ? "bg-[#8B5CF6] text-white hover:bg-[#7C4EE7]" 
              : "hover:bg-[#F3E8FF] hover:text-[#8B5CF6] border-[#8B5CF6]/30"}`}
        >
          <UserCheck className={`h-20 w-20 mb-3 ${roleFilter === "employed" ? "text-white" : "text-[#8B5CF6]"}`} />
          <div className="text-base font-medium">Employed</div>
          <div className={`text-3xl font-bold mt-2 ${roleFilter === "employed" ? "text-white" : "text-[#8B5CF6]"}`}>{employedCount}</div>
        </Button>
        
        <Button
          variant={roleFilter === "contractor" ? "default" : "outline"}
          onClick={() => setRoleFilter("contractor")}
          className={`h-48 text-lg font-medium shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center
            ${roleFilter === "contractor" 
              ? "bg-[#F97316] text-white hover:bg-[#E76A14]" 
              : "hover:bg-[#FFEDD5] hover:text-[#F97316] border-[#F97316]/30"}`}
        >
          <Hammer className={`h-20 w-20 mb-3 ${roleFilter === "contractor" ? "text-white" : "text-[#F97316]"}`} />
          <div className="text-base font-medium">Contractors</div>
          <div className={`text-3xl font-bold mt-2 ${roleFilter === "contractor" ? "text-white" : "text-[#F97316]"}`}>{contractorCount}</div>
        </Button>
      </div>
      
      {/* Action buttons */}
      <TechniciansPageHeader 
        onAddTechnician={() => setShowAddModal(true)}
        exportTechnicians={exportTechnicians}
        onEditRoles={() => setShowRolesModal(true)}
      />
      
      <div className="mb-6">
        <div className="mb-4">
          <TechnicianSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
        
        <TechnicianFilters 
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
      
      <EditRolesModal
        open={showRolesModal}
        onOpenChange={setShowRolesModal}
        onSaveRoles={handleSaveRoles}
        currentRoles={customRoles}
        technicians={globalTechnicians}
      />
    </div>
  );
};

export default Technicians;
