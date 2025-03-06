
import React, { useState } from 'react';
import { PlusIcon, UserPlusIcon, CalendarPlusIcon, FileTextIcon, XIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className={`flex flex-col-reverse gap-4 items-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
                onClick={() => console.log('Add Client')}
              >
                <UserPlusIcon size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Client</p>
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
  );
};

export default QuickActions;
