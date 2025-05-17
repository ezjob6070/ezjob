
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Technician } from "@/types/project";
import { initialTechnicians } from "@/data/technicians";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

export const useTechnicianDetail = (technicianId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { technicians: globalTechnicians } = useGlobalState();
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
    let techData = globalTechnicians.find(tech => tech.id === technicianId);
    
    if (!techData) {
      techData = initialTechnicians.find(tech => tech.id === technicianId);
    }
    
    if (techData) {
      // Generate initials from name if not present
      const nameInitials = techData.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      // Ensure we have a valid technician object with all required properties
      const completeTechData: Technician = {
        ...techData,
        // Ensure hireDate is a valid string
        hireDate: typeof techData.hireDate === 'string' ? techData.hireDate : 
                 (techData.hireDate ? new Date(techData.hireDate).toISOString().split('T')[0] : '2023-01-01'),
        // Make sure all required properties are present
        email: techData.email || 'no-email@example.com',
        specialty: techData.specialty || '',
        status: techData.status || 'active',
        paymentType: (techData.paymentType as Technician["paymentType"]) || 'hourly',
        paymentRate: techData.paymentRate || 0,
        hourlyRate: techData.hourlyRate || 0,
        // Ensure salaryBasis is a valid type
        salaryBasis: techData.salaryBasis || 'hourly',
        completedJobs: techData.completedJobs || 0,
        cancelledJobs: techData.cancelledJobs || 0,
        totalRevenue: techData.totalRevenue || 0,
        rating: techData.rating || 0,
        // Use existing initials or generate from name
        initials: techData.initials || nameInitials,
        // Handle image properties
        profileImage: techData.profileImage || techData.imageUrl,
        imageUrl: techData.imageUrl || techData.profileImage,
        // Ensure incentiveType is a valid enum value if provided
        incentiveType: techData.incentiveType as Technician["incentiveType"],
        // Role is optional but should be valid if provided
        role: techData.role as Technician["role"],
        // Add sensitive information if it exists
        ssn: techData.ssn,
        driverLicense: techData.driverLicense,
        idNumber: techData.idNumber,
      };
      
      setTechnician(completeTechData);
      setFilteredTechnicians([completeTechData]);
      setDisplayedTechnicians([completeTechData]);
      setSelectedTechnicianId(completeTechData.id);
    } else {
      toast({
        title: "Error",
        description: "Technician not found",
        variant: "destructive",
      });
      navigate("/technicians");
    }
  }, [technicianId, navigate, toast, globalTechnicians]);

  const handleUpdateTechnician = (values: TechnicianEditFormValues) => {
    if (!technician) return;
    
    const updatedTechnician = {
      ...technician,
      ...values,
      id: technician.id,
      paymentRate: Number(values.paymentRate),
      hourlyRate: Number(values.hourlyRate || technician.hourlyRate),
      incentiveAmount: values.incentiveAmount ? Number(values.incentiveAmount) : technician.incentiveAmount,
      profileImage: values.profileImage || technician.profileImage,
      imageUrl: values.profileImage || technician.imageUrl,
      notes: values.notes || technician.notes,
      // Update sensitive information
      ssn: values.ssn || technician.ssn,
      driverLicense: values.driverLicenseNumber ? {
        number: values.driverLicenseNumber,
        state: values.driverLicenseState || "",
        expirationDate: values.driverLicenseExpiration || ""
      } : technician.driverLicense,
      idNumber: values.idNumber || technician.idNumber,
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

  return {
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
  };
};

export default useTechnicianDetail;
