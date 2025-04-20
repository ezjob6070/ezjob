
import { useState, useEffect } from "react";
import { initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import TechnicianTabs from "@/components/technicians/TechnicianTabs";
import TopTechnicianCards from "@/components/technicians/TopTechnicianCards";
import TopRevenueTechniciansChart from "@/components/technicians/TopRevenueTechniciansChart";
import JobsRevenueComparison from "@/components/technicians/JobsRevenueComparison";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechnicianAnalytics = () => {
  const navigate = useNavigate();
  const { technicians: globalTechnicians } = useGlobalState();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  
  useEffect(() => {
    // Use global technicians if available, otherwise fall back to initial data
    if (globalTechnicians && globalTechnicians.length > 0) {
      setTechnicians(globalTechnicians);
    } else {
      setTechnicians(initialTechnicians);
    }
  }, [globalTechnicians]);

  return (
    <div className="container py-8">
      {/* Main Technician Navigation Tabs */}
      <TechnicianTabs currentTab="analytics" />

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technician Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Performance analysis and recognition for top-performing technicians
          </p>
        </div>
        
        {(!technicians || technicians.length === 0) && (
          <Button 
            onClick={() => navigate("/technicians/new")}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Technician
          </Button>
        )}
      </div>

      {(!technicians || technicians.length === 0) ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Technicians Found</h3>
          <p className="text-gray-500 mb-6">Add technicians to your team to view performance analytics.</p>
          <Button 
            onClick={() => navigate("/technicians/new")}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Your First Technician
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Top Technician Performers</h2>
            <p className="text-muted-foreground">Recognition and performance analytics for your best technicians</p>
          </div>

          {/* Top Technician Cards */}
          <TopTechnicianCards technicians={technicians} />

          {/* Top Technicians by Revenue Chart */}
          <TopRevenueTechniciansChart technicians={technicians} />

          {/* Jobs vs Revenue Comparison */}
          <JobsRevenueComparison technicians={technicians} />
        </>
      )}
    </div>
  );
};

export default TechnicianAnalytics;
