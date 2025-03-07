
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialTechnicians } from "@/data/technicians";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";

const FinanceTechnicians = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [activeTechnicians, setActiveTechnicians] = useState(initialTechnicians.filter(tech => tech.status === "active"));
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/finance">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Technician Finance</h2>
          </div>
          <p className="text-muted-foreground">
            Track technician performance and earnings.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <DateRangeSelector date={date} setDate={setDate} />
        </div>
      </div>

      {/* Technician Finance Section */}
      <TechnicianFinanceSection 
        activeTechnicians={activeTechnicians} 
      />
    </div>
  );
};

export default FinanceTechnicians;
