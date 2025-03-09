
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BarChart2 } from "lucide-react";

type TechnicianTabsProps = {
  currentTab: "list" | "analytics";
};

const TechnicianTabs = ({ currentTab }: TechnicianTabsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Tabs defaultValue={currentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="list" 
            className="text-lg py-3 font-medium"
            onClick={() => navigate("/technicians/list")}
          >
            <List className="mr-2 h-5 w-5" />
            Technician List
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="text-lg py-3 font-medium"
            onClick={() => navigate("/technicians/analytics")}
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            Technician Analytics
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TechnicianTabs;
