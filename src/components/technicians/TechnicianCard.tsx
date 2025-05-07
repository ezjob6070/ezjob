
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Technician } from "@/types/technician";
import { Wrench, Briefcase, UserCheck, Hammer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TechnicianCardProps {
  technician: Technician;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

export default function TechnicianCard({
  technician,
  selected,
  onSelect,
  onClick
}: TechnicianCardProps) {
  const navigate = useNavigate();
  
  const revenue = technician.totalRevenue?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) || "0";
  
  // Light yellow theme for all roles
  const getRoleStyles = () => {
    const baseColor = "#8B7E2F"; // Base text color for all roles
    const baseBgColor = "#FEF7CD"; // Light yellow background
    
    switch(technician.role) {
      case "technician":
        return {
          color: baseColor,
          bgColor: baseBgColor,
          icon: <Wrench className="h-4 w-4 text-[#8B7E2F]" />,
          label: "Technician",
          borderHover: "hover:border-[#8B7E2F]",
          gradientFrom: "from-yellow-50",
          gradientTo: "to-yellow-100",
          iconBg: "bg-[#FEF7CD]"
        };
      case "salesman":
        return {
          color: baseColor,
          bgColor: baseBgColor,
          icon: <Briefcase className="h-4 w-4 text-[#8B7E2F]" />,
          label: "Salesman",
          borderHover: "hover:border-[#8B7E2F]",
          gradientFrom: "from-yellow-50",
          gradientTo: "to-yellow-100",
          iconBg: "bg-[#FEF7CD]"
        };
      case "employed":
        return {
          color: baseColor,
          bgColor: baseBgColor,
          icon: <UserCheck className="h-4 w-4 text-[#8B7E2F]" />,
          label: "Employed",
          borderHover: "hover:border-[#8B7E2F]",
          gradientFrom: "from-yellow-50",
          gradientTo: "to-yellow-100",
          iconBg: "bg-[#FEF7CD]"
        };
      case "contractor":
        return {
          color: baseColor,
          bgColor: baseBgColor,
          icon: <Hammer className="h-4 w-4 text-[#8B7E2F]" />,
          label: "Contractor",
          borderHover: "hover:border-[#8B7E2F]",
          gradientFrom: "from-yellow-50",
          gradientTo: "to-yellow-100",
          iconBg: "bg-[#FEF7CD]"
        };
      default:
        return {
          color: baseColor,
          bgColor: baseBgColor,
          icon: <UserCheck className="h-4 w-4 text-[#8B7E2F]" />,
          label: "Staff",
          borderHover: "hover:border-[#8B7E2F]",
          gradientFrom: "from-yellow-50",
          gradientTo: "to-yellow-100",
          iconBg: "bg-[#FEF7CD]"
        };
    }
  };
  
  const roleStyle = getRoleStyles();
  
  const handleCardClick = () => {
    // Navigate to technician detail if onClick is not provided
    if (typeof onClick === 'function') {
      onClick(technician.id);
    } else {
      navigate(`/technicians/${technician.id}`);
    }
  };
  
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col rounded-lg border p-4 hover:cursor-pointer hover:border-2 bg-gradient-to-br",
        roleStyle.gradientFrom, roleStyle.gradientTo,
        selected ? `border-2 border-[#8B7E2F]` : `border-border hover:border-[#8B7E2F]`,
        "transition-all hover:shadow-md"
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => onSelect(technician.id)}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-2 top-2 rounded-full border-2 border-[#8B7E2F] ring-offset-background focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex items-center">
        <Avatar className="h-12 w-12 border-2" style={{ borderColor: "#8B7E2F" }}>
          {technician.imageUrl ? (
            <AvatarImage src={technician.imageUrl} alt={technician.name} />
          ) : (
            <AvatarFallback 
              className="font-medium text-[#8B7E2F]"
              style={{ backgroundColor: "#FEF7CD" }}
            >
              {technician.initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-4 flex flex-col">
          <div className="text-sm font-medium">{technician.name}</div>
          <div className="text-xs text-muted-foreground">
            {technician.specialty}
          </div>
          <div className="flex items-center mt-1 px-2 py-0.5 rounded-full text-xs" 
               style={{ backgroundColor: "#FEF7CD", color: "#8B7E2F" }}>
            {roleStyle.icon}
            <span className="ml-1 font-medium">{roleStyle.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center gap-2 mt-4">
        <div className="p-1 rounded-md bg-white bg-opacity-60 shadow-sm">
          <div className="text-sm font-medium text-[#8B7E2F]">{technician.completedJobs}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="p-1 rounded-md bg-white bg-opacity-60 shadow-sm">
          <div className="text-sm font-medium text-[#8B7E2F]">{technician.cancelledJobs}</div>
          <div className="text-xs text-muted-foreground">Cancelled</div>
        </div>
        <div className="p-1 rounded-md bg-white bg-opacity-60 shadow-sm">
          <div className="text-sm font-medium text-[#8B7E2F]">${revenue}</div>
          <div className="text-xs text-muted-foreground">Revenue</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-opacity-30 text-xs text-muted-foreground" style={{ borderColor: "#8B7E2F" }}>
        <div className="flex justify-between items-center">
          <div>Status: <span className="capitalize">{technician.status}</span></div>
          <div>Rating: <span className="text-[#8B7E2F]">{technician.rating}/5</span></div>
        </div>
      </div>
    </div>
  );
}
