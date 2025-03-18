
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import TechnicianInvoiceDialog from "../invoices/TechnicianInvoiceDialog";
import TechnicianFinancialFilterBar from "../filters/TechnicianFinancialFilterBar";
import TechnicianFinancialTableContent from "../tables/TechnicianFinancialTableContent";
import useTechnicianTableSorting from "@/hooks/technicians/useTechnicianTableSorting";

interface TechnicianFinancialTableProps {
  filteredTechnicians: Technician[];
  displayedTechnicians: Technician[];
  selectedTechnicianNames: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (value: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
  onTechnicianSelect: (technician: Technician) => void;
  selectedTechnicianId?: string;
}

const TechnicianFinancialTable: React.FC<TechnicianFinancialTableProps> = ({
  filteredTechnicians,
  displayedTechnicians,
  selectedTechnicianNames,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  onTechnicianSelect,
  selectedTechnicianId
}) => {
  const technicianNames = filteredTechnicians.map(tech => tech.name);
  const { sortBy, setSortBy, sortedTechnicians } = useTechnicianTableSorting(displayedTechnicians);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedTechnicianForInvoice, setSelectedTechnicianForInvoice] = useState<Technician | null>(null);

  const handleCreateInvoice = (technician: Technician) => {
    setSelectedTechnicianForInvoice(technician);
    setInvoiceDialogOpen(true);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle>Technician Financial Performance</CardTitle>
            <CardDescription>Earnings and profit metrics for each technician</CardDescription>
          </div>
          {selectedTechnicianId && (
            <Button 
              variant="outline" 
              className="gap-2 whitespace-nowrap"
              onClick={() => {
                const selectedTech = displayedTechnicians.find(tech => tech.id === selectedTechnicianId);
                if (selectedTech) handleCreateInvoice(selectedTech);
              }}
            >
              <FileText className="h-4 w-4" />
              Create Invoice
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <TechnicianFinancialFilterBar 
          technicianNames={technicianNames}
          selectedTechnicians={selectedTechnicianNames}
          toggleTechnician={toggleTechnician}
          clearFilters={clearFilters}
          applyFilters={applyFilters}
          paymentTypeFilter={paymentTypeFilter}
          setPaymentTypeFilter={setPaymentTypeFilter}
          localDateRange={localDateRange}
          setLocalDateRange={setLocalDateRange}
          sortBy={sortBy as string}
          setSortBy={setSortBy}
        />

        {/* Table */}
        <TechnicianFinancialTableContent 
          technicians={sortedTechnicians}
          selectedTechnicianId={selectedTechnicianId}
          onTechnicianSelect={onTechnicianSelect}
          onCreateInvoice={handleCreateInvoice}
        />

        {/* Invoice Dialog */}
        <TechnicianInvoiceDialog
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
          technician={selectedTechnicianForInvoice}
        />
      </CardContent>
    </Card>
  );
};

export default TechnicianFinancialTable;
