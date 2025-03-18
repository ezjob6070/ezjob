
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, FileText, Download } from "lucide-react";
import TechnicianFinance from "@/components/finance/TechnicianFinance";

const FinanceTechnicians = () => {
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
            Track technician performance, generate invoices, and manage payments.
          </p>
        </div>
        
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Financial Report
          </Button>
        </div>
      </div>

      {/* Technician Finance Section */}
      <TechnicianFinance />
    </div>
  );
};

export default FinanceTechnicians;
