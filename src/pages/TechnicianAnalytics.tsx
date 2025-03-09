
import { useState } from "react";
import { initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";
import TechnicianTabs from "@/components/technicians/TechnicianTabs";
import TopTechnicianCards from "@/components/technicians/TopTechnicianCards";
import TopRevenueTechniciansChart from "@/components/technicians/TopRevenueTechniciansChart";
import JobsRevenueComparison from "@/components/technicians/JobsRevenueComparison";

const TechnicianAnalytics = () => {
  const [technicians] = useState<Technician[]>(initialTechnicians);

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
      </div>

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
    </div>
  );
};

export default TechnicianAnalytics;
