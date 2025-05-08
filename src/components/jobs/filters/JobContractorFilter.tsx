
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface JobContractorFilterProps {
  contractors: string[];
  selectedContractors: string[];
  toggleContractor: (contractorName: string) => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
}

const JobContractorFilter = ({
  contractors,
  selectedContractors,
  toggleContractor,
  selectAllContractors,
  deselectAllContractors
}: JobContractorFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredContractors = contractors.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const allSelected = contractors.length > 0 && 
    selectedContractors.length === contractors.length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Contractor Filter</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAllContractors}
            disabled={allSelected || contractors.length === 0}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deselectAllContractors}
            disabled={selectedContractors.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search contractors..." 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {contractors.length > 0 ? (
        <>
          <div className="space-y-1">
            <Checkbox
              id="contractors-all"
              checked={allSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  selectAllContractors();
                } else {
                  deselectAllContractors();
                }
              }}
            />
            <Label
              htmlFor="contractors-all"
              className="text-sm font-medium ml-2"
            >
              All Contractors
            </Label>
          </div>

          <ScrollArea className="h-72 pr-4">
            <div className="space-y-1">
              {filteredContractors.length > 0 ? (
                filteredContractors.map((contractorName) => (
                  <div key={contractorName} className="flex items-center">
                    <Checkbox
                      id={`contractor-${contractorName}`}
                      checked={selectedContractors.includes(contractorName)}
                      onCheckedChange={() => toggleContractor(contractorName)}
                    />
                    <Label
                      htmlFor={`contractor-${contractorName}`}
                      className="text-sm ml-2"
                    >
                      {contractorName}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  No contractors found matching your search
                </p>
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <p className="text-sm text-muted-foreground py-2">No contractors available</p>
      )}
    </div>
  );
};

export default JobContractorFilter;
