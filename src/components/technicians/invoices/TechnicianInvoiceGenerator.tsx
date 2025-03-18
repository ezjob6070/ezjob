
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import TechnicianInvoiceDialog from "./TechnicianInvoiceDialog";
import TechnicianInvoicePreview from "./TechnicianInvoicePreview";
import { toast } from "sonner";

interface TechnicianInvoiceGeneratorProps {
  technicians: Technician[];
}

const TechnicianInvoiceGenerator: React.FC<TechnicianInvoiceGeneratorProps> = ({ technicians }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);

  const handleOpenInvoiceDialog = (technician: Technician) => {
    setSelectedTechnician(technician);
    setDialogOpen(true);
  };

  const handleInvoiceSettingsSaved = (settings: any) => {
    setInvoiceSettings(settings);
    setDialogOpen(false);
    setPreviewOpen(true);
    console.log("Invoice settings:", settings);
  };

  const handleGenerateInvoice = () => {
    toast.success("Invoice saved successfully!");
    setPreviewOpen(false);
  };

  return (
    <div>
      <Button onClick={() => technicians.length > 0 && handleOpenInvoiceDialog(technicians[0])}>
        <FileText className="mr-2 h-4 w-4" />
        Generate Invoice
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <TechnicianInvoiceDialog 
              technician={selectedTechnician}
              onSettingsSaved={handleInvoiceSettingsSaved}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="absolute right-4 top-4 z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setPreviewOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedTechnician && invoiceSettings && (
            <div className="space-y-4">
              <TechnicianInvoicePreview 
                technician={selectedTechnician}
                settings={invoiceSettings}
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Back to Settings
                </Button>
                <Button onClick={handleGenerateInvoice}>
                  Save Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianInvoiceGenerator;
