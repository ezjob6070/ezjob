
import { useState } from "react";
import { JobSource } from "@/types/jobSource";

const SAMPLE_JOB_SOURCES: JobSource[] = [
  { 
    id: "js1", 
    name: "Website", 
    isActive: true, 
    paymentType: "percentage", 
    paymentValue: 10, 
    totalJobs: 120, 
    totalRevenue: 55000, 
    profit: 23000,
    createdAt: new Date(),
    email: "website@example.com",
    phone: "(555) 123-4567",
    notes: "Our company website leads"
  },
  { 
    id: "js2", 
    name: "Referral", 
    isActive: true, 
    paymentType: "fixed", 
    paymentValue: 50, 
    totalJobs: 80, 
    totalRevenue: 40000, 
    profit: 18000,
    createdAt: new Date(),
    notes: "Customer referrals program"
  },
  { 
    id: "js3", 
    name: "Google", 
    isActive: true, 
    paymentType: "percentage", 
    paymentValue: 15, 
    totalJobs: 150, 
    totalRevenue: 70000,
    profit: 30000,
    createdAt: new Date(),
    website: "https://google.com",
    email: "adsales@google.com",
    phone: "(555) 987-6543"
  },
  { 
    id: "js4", 
    name: "Facebook", 
    isActive: false, 
    paymentType: "fixed", 
    paymentValue: 75, 
    totalJobs: 65, 
    totalRevenue: 32000, 
    profit: 12000,
    createdAt: new Date(),
    website: "https://facebook.com",
    email: "marketing@facebook.com"
  },
  { 
    id: "js5", 
    name: "HomeAdvisor", 
    isActive: true, 
    paymentType: "percentage", 
    paymentValue: 20, 
    totalJobs: 95, 
    totalRevenue: 48000, 
    profit: 22000,
    createdAt: new Date(),
    website: "https://homeadvisor.com",
    phone: "(555) 765-4321",
    notes: "Contractor platform for service leads"
  },
  { 
    id: "js6", 
    name: "Angi", 
    isActive: true, 
    paymentType: "fixed", 
    paymentValue: 100, 
    totalJobs: 45, 
    totalRevenue: 25000, 
    profit: 10000,
    createdAt: new Date(),
    website: "https://angi.com",
    email: "partners@angi.com",
    phone: "(555) 234-5678",
    notes: "Home services marketplace"
  },
];

export const JOB_SOURCES = [
  { id: "js1", name: "Website" },
  { id: "js2", name: "Referral" },
  { id: "js3", name: "Google" },
  { id: "js4", name: "Facebook" },
  { id: "js5", name: "HomeAdvisor" },
  { id: "js6", name: "Angi" },
];

export function useJobSourceData() {
  const [jobSources, setJobSources] = useState<JobSource[]>(SAMPLE_JOB_SOURCES);
  const [isJobSourceSidebarOpen, setIsJobSourceSidebarOpen] = useState(false);
  const [isCreateJobSourceModalOpen, setIsCreateJobSourceModalOpen] = useState(false);
  const [selectedJobSourceForEdit, setSelectedJobSourceForEdit] = useState<JobSource | null>(null);

  const handleAddJobSource = () => {
    setIsCreateJobSourceModalOpen(true);
  };

  const handleEditJobSource = (jobSource: JobSource) => {
    setSelectedJobSourceForEdit(jobSource);
    setIsCreateJobSourceModalOpen(true);
  };

  const toggleJobSourceSidebar = () => {
    setIsJobSourceSidebarOpen(!isJobSourceSidebarOpen);
  };

  return {
    jobSources,
    setJobSources,
    isJobSourceSidebarOpen,
    setIsJobSourceSidebarOpen,
    isCreateJobSourceModalOpen,
    setIsCreateJobSourceModalOpen,
    selectedJobSourceForEdit,
    handleAddJobSource,
    handleEditJobSource,
    toggleJobSourceSidebar
  };
}
