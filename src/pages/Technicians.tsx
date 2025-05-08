
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechniciansPageHeader from "@/components/technicians/TechniciansPageHeader";
import TechnicianSearchBar from "@/components/technicians/TechnicianSearchBar";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { SortOption } from "@/types/sortOptions";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
    setTechnicians,
    setRoleFilter
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
  const totalCount = globalTechnicians.length;

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
      
      {/* Role Filter using dropdown */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-64">
            <Label htmlFor="role-filter" className="mb-2 block text-sm font-medium">Filter by role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger id="role-filter" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Staff ({totalCount})
                </SelectItem>
                <SelectItem value="technician">
                  Technicians ({technicianCount})
                </SelectItem>
                <SelectItem value="salesman">
                  Salesmen ({salesmanCount})
                </SelectItem>
                <SelectItem value="employed">
                  Employed ({employedCount})
                </SelectItem>
                <SelectItem value="contractor">
                  Contractors ({contractorCount})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded border">
              <div className="text-gray-500">All Staff</div>
              <div className="font-semibold text-lg">{totalCount}</div>
            </div>
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <div className="text-blue-700">Technicians</div>
              <div className="font-semibold text-lg text-blue-700">{technicianCount}</div>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-100">
              <div className="text-green-700">Salesmen</div>
              <div className="font-semibold text-lg text-green-700">{salesmanCount}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded border border-purple-100">
              <div className="text-purple-700">Employed</div>
              <div className="font-semibold text-lg text-purple-700">{employedCount}</div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Action buttons */}
      <TechniciansPageHeader 
        onAddTechnician={() => setShowAddModal(true)}
        exportTechnicians={exportTechnicians}
      />
      
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
