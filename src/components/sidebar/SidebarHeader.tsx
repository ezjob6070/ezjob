
import { IndustryType } from "./sidebarTypes";

type SidebarHeaderProps = {
  industry: IndustryType;
  onCycleIndustry: () => void;
};

const SidebarHeader = ({ industry, onCycleIndustry }: SidebarHeaderProps) => {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
      <h1 className="text-xl font-semibold tracking-tight">Essence CRM</h1>
      <div className="flex items-center">
        <button 
          onClick={onCycleIndustry}
          className="text-xs bg-sidebar-accent/30 px-2 py-1 rounded-md"
        >
          {industry.replace('_', ' ')}
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
