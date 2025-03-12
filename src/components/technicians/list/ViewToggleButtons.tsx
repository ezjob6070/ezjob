
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleButtonsProps {
  displayMode: "card" | "table";
  onDisplayModeChange: (mode: "card" | "table") => void;
}

const ViewToggleButtons: React.FC<ViewToggleButtonsProps> = ({
  displayMode,
  onDisplayModeChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={displayMode === "table" ? "default" : "outline"} 
        size="sm"
        onClick={() => onDisplayModeChange("table")}
      >
        <List className="h-4 w-4 mr-2" />
        Table
      </Button>
      <Button 
        variant={displayMode === "card" ? "default" : "outline"} 
        size="sm"
        onClick={() => onDisplayModeChange("card")}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Cards
      </Button>
    </div>
  );
};

export default ViewToggleButtons;
