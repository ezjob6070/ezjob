
import { Building, Home } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IndustryType } from "@/components/sidebar/sidebarTypes";

interface IndustrySelectorProps {
  currentIndustry: IndustryType;
  onIndustryChange: (industry: IndustryType) => void;
}

const IndustrySelector = ({ currentIndustry, onIndustryChange }: IndustrySelectorProps) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <ToggleGroup type="single" value={currentIndustry} onValueChange={(value: IndustryType) => value && onIndustryChange(value)}>
        <ToggleGroupItem value="construction" aria-label="Construction CRM" className="gap-2">
          <Building className="h-5 w-5" />
          <span className="hidden md:inline">Construction</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="real_estate" aria-label="Real Estate CRM" className="gap-2">
          <Home className="h-5 w-5" />
          <span className="hidden md:inline">Real Estate</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default IndustrySelector;
