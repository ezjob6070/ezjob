
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface IndustryFilterProps {
  selectedIndustries: string[];
  toggleIndustry: (industry: string) => void;
  industries: string[];
  addIndustry: (industry: string) => void;
}

const IndustryFilter: React.FC<IndustryFilterProps> = ({
  selectedIndustries,
  toggleIndustry,
  industries,
  addIndustry
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState("");

  const handleAddIndustry = () => {
    if (!newIndustry.trim()) {
      toast.error("Industry name cannot be empty");
      return;
    }

    if (industries.includes(newIndustry.trim())) {
      toast.error("This industry already exists");
      return;
    }

    addIndustry(newIndustry.trim());
    setNewIndustry("");
    setIsDialogOpen(false);
    toast.success("Industry added successfully");
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-auto justify-between px-3 py-5 text-base font-medium"
          >
            <Filter className="mr-2 h-4 w-4" />
            <span>
              {selectedIndustries.length === 0 ? "All Industries" : 
                selectedIndustries.length === 1 ? `${selectedIndustries[0]}` :
                `${selectedIndustries.length} Industries`}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="p-3 space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {industries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`industry-${industry}`} 
                    checked={selectedIndustries.includes(industry)}
                    onCheckedChange={() => toggleIndustry(industry)}
                  />
                  <label 
                    htmlFor={`industry-${industry}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {industry}
                  </label>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex justify-center"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Industry
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Industry</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Industry name"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIndustry}>
              Add Industry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IndustryFilter;
