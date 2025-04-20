import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Technician } from "@/types/technician";
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
  }, [technicianId, navigate, toast, globalTechnicians]);

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
