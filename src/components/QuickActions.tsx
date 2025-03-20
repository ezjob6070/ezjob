
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, UserPlusIcon, CalendarPlusIcon, FileTextIcon, XIcon, ClipboardListIcon, CalculatorIcon, BriefcaseIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import AddClientModal from './AddClientModal';
import CreateJobModal from './jobs/CreateJobModal';
import { Job } from './jobs/JobTypes';
import { initialTechnicians } from '@/data/technicians';
import { JOB_SOURCES } from '@/hooks/jobs/useJobSourceData';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAddClient = (client: any) => {
    // In a real app, this would be handled by a global state management solution
    // For now, we'll just show a toast and navigate to the clients page
    toast({
      title: "Success",
      description: "New client added successfully",
    });
    navigate('/clients');
    setShowAddClientModal(false);
    setIsOpen(false);
  };

  const handleAddJob = (job: Job) => {
    toast({
      title: "Job created",
      description: `New job for ${job.clientName} has been created and is in progress.`,
    });
    setShowCreateJobModal(false);
    setIsOpen(false);
    navigate('/jobs');
  };

  // Updated to directly open the modal instead of navigating
  const handleCreateJob = () => {
    setShowCreateJobModal(true);
    setIsOpen(false);
  };

  const handleCreateEstimate = () => {
    toast({
      title: "Creating New Estimate",
      description: "Navigating to estimate creation screen",
    });
    navigate('/estimates', { state: { openCreateModal: true } });
    setIsOpen(false);
  };

  const handleCreateTask = () => {
    toast({
      title: "Creating New Task",
      description: "Navigating to task creation screen",
    });
    navigate('/tasks', { state: { openCreateModal: true } });
    setIsOpen(false);
  };

  // Convert technicians data to format expected by CreateJobModal
  const technicianOptions = initialTechnicians.map(tech => ({ 
    id: tech.id, 
    name: tech.name 
  }));

  // Convert job sources data to format expected by CreateJobModal
  const jobSourceOptions = JOB_SOURCES.map(source => ({ 
    id: source.id, 
    name: source.name 
  }));

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <div className={`flex flex-col-reverse gap-4 items-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                  onClick={handleCreateTask}
                >
                  <ClipboardListIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                  onClick={handleCreateEstimate}
                >
                  <CalculatorIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Estimate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                  onClick={handleCreateJob}
                >
                  <BriefcaseIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                  onClick={() => console.log('Schedule Event')}
                >
                  <CalendarPlusIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Schedule Event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                  onClick={() => setShowAddClientModal(true)}
                >
                  <UserPlusIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Client</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                  onClick={() => console.log('Add note')}
                >
                  <FileTextIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <button 
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-blue-600'}`}
          onClick={toggleMenu}
        >
          {isOpen ? <XIcon size={24} className="text-white" /> : <PlusIcon size={24} className="text-white" />}
        </button>
      </div>

      {/* Modals */}
      <AddClientModal 
        open={showAddClientModal}
        onOpenChange={setShowAddClientModal}
        onAddClient={handleAddClient}
      />

      <CreateJobModal
        open={showCreateJobModal}
        onOpenChange={setShowCreateJobModal}
        onAddJob={handleAddJob}
        technicians={technicianOptions}
        jobSources={jobSourceOptions}
      />
    </>
  );
};

export default QuickActions;
