
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Technician } from "@/types/technician";
import { format } from "date-fns";
import { useMemo } from "react";
import { Wrench, Briefcase, UserCheck } from "lucide-react";

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
  const revenue = useMemo(() => {
    if (!technician.totalRevenue) return "0";

    return technician.totalRevenue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [technician.totalRevenue]);
  
  // Enhanced role-specific styling with proper icons
  const getRoleStyles = () => {
    switch(technician.role) {
      case "technician":
        return {
          color: "#0EA5E9", // Ocean Blue
          bgColor: "#E0F2FE",
          icon: <Wrench className="h-4 w-4 text-[#0EA5E9]" />,
          label: "Technician",
          borderHover: "hover:border-[#0EA5E9]"
        };
      case "salesman":
        return {
          color: "#10B981", // Emerald Green
          bgColor: "#ECFDF5",
          icon: <Briefcase className="h-4 w-4 text-[#10B981]" />,
          label: "Salesman",
          borderHover: "hover:border-[#10B981]"
        };
      case "employed":
        return {
          color: "#8B5CF6", // Vivid Purple
          bgColor: "#F3E8FF",
          icon: <UserCheck className="h-4 w-4 text-[#8B5CF6]" />,
          label: "Employed",
          borderHover: "hover:border-[#8B5CF6]"
        };
      default:
        return {
          color: "#6E59A5", // Tertiary Purple
          bgColor: "#F1F0FB",
          icon: <UserCheck className="h-4 w-4 text-[#6E59A5]" />,
          label: "Staff",
          borderHover: "hover:border-[#6E59A5]"
        };
    }
  };
  
  const roleStyle = getRoleStyles();
  
  return (
    <div
      onClick={() => onClick(technician.id)}
      className={cn(
        "group relative flex flex-col rounded-lg border p-4 hover:cursor-pointer hover:border-2",
        selected ? `border-2 border-[${roleStyle.color}]` : `border-border ${roleStyle.borderHover}`,
        "transition-all hover:shadow-md"
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => onSelect(technician.id)}
        className="absolute right-2 top-2 rounded-full border-2 ring-offset-background focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex items-center">
        <Avatar className="h-12 w-12 border-2" style={{ borderColor: roleStyle.color }}>
          {technician.imageUrl ? (
            <AvatarImage src={technician.imageUrl} alt={technician.name} />
          ) : (
            <AvatarFallback 
              style={{ backgroundColor: roleStyle.bgColor, color: roleStyle.color }}
              className="font-medium"
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
               style={{ backgroundColor: roleStyle.bgColor, color: roleStyle.color }}>
            {roleStyle.icon}
            <span className="ml-1 font-medium">{roleStyle.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center gap-2 mt-4">
        <div className="p-1 rounded-md" style={{ backgroundColor: `${roleStyle.bgColor}40` }}>
          <div className="text-sm font-medium">{technician.completedJobs}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="p-1 rounded-md" style={{ backgroundColor: `${roleStyle.bgColor}40` }}>
          <div className="text-sm font-medium">{technician.cancelledJobs}</div>
          <div className="text-xs text-muted-foreground">Cancelled</div>
        </div>
        <div className="p-1 rounded-md" style={{ backgroundColor: `${roleStyle.bgColor}40` }}>
          <div className="text-sm font-medium" style={{ color: roleStyle.color }}>${revenue}</div>
          <div className="text-xs text-muted-foreground">Revenue</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <div>Status: <span className="capitalize">{technician.status}</span></div>
          <div>Rating: <span style={{ color: roleStyle.color }}>{technician.rating}/5</span></div>
        </div>
      </div>
    </div>
  );
}
