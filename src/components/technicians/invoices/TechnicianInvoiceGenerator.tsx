
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, X } from "lucide-react";
import TechnicianInvoiceDialog from "./TechnicianInvoiceDialog";
import TechnicianInvoicePreview from "./TechnicianInvoicePreview";
import { toast } from "@/components/ui/use-toast";

interface TechnicianInvoiceGeneratorProps {
  technicians: Technician[];
  selectedTechnician?: Technician;
}

const TechnicianInvoiceGenerator: React.FC<TechnicianInvoiceGeneratorProps> = ({ 
  technicians,
  selectedTechnician 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTechnician, setActiveTechnician] = useState<Technician | null>(selectedTechnician || null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>({
    invoiceTitle: "Technician Invoice",
    invoiceNumber: `INV-${Date.now().toString().substring(8)}`,
    showJobAddress: true,
    showJobDate: true,
    showTechnicianEarnings: true,
    showCompanyProfit: false,
    showPartsValue: true,
    showDetails: true,
    jobStatus: "completed",
    dateRange: "last-month"
  });

  const handleOpenInvoiceDialog = (technician: Technician) => {
    setActiveTechnician(technician);
    setDialogOpen(true);
  };

  const handleInvoiceSettingsSaved = (settings: any) => {
    setInvoiceSettings({
      ...invoiceSettings,
      ...settings
    });
    setDialogOpen(false);
    setPreviewOpen(true);
  };

  const handleGenerateInvoice = () => {
    toast({
      title: "Success",
      description: "Invoice generated successfully!",
    });
    setPreviewOpen(false);
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Download Started",
      description: "Invoice is being downloaded...",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button 
        onClick={() => {
          if (selectedTechnician) {
            handleOpenInvoiceDialog(selectedTechnician);
          } else if (technicians.length > 0) {
            handleOpenInvoiceDialog(technicians[0]);
          } else {
            toast({
              title: "Error",
              description: "No technicians available",
              variant: "destructive"
            });
          }
        }}
        className="flex items-center gap-2"
        variant="outline"
      >
        <FileText className="h-4 w-4" />
        Create Invoice
      </Button>

      <Button 
        onClick={handleDownloadInvoice}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Download className="h-4 w-4" />
        Download Invoice
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          {activeTechnician && (
            <TechnicianInvoiceDialog 
              technician={activeTechnician}
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
          
          {activeTechnician && invoiceSettings && (
            <div className="space-y-4">
              <TechnicianInvoicePreview 
                technician={activeTechnician}
                settings={invoiceSettings}
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => {
                  setPreviewOpen(false);
                  setDialogOpen(true);
                }}>
                  Back to Settings
                </Button>
                <Button onClick={handleGenerateInvoice}>
                  Save Invoice
                </Button>
                <Button variant="outline" className="gap-1">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download PDF
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
