
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployeeDocument, DocumentType } from "@/types/employee";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDocument: EmployeeDocument | null;
  getDocumentTypeLabel: (type: DocumentType) => string;
  onDeleteDocument: (documentId: string) => void;
}

const DocumentViewDialog = ({
  open,
  onOpenChange,
  selectedDocument,
  getDocumentTypeLabel,
  onDeleteDocument
}: DocumentViewDialogProps) => {
  if (!selectedDocument) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{selectedDocument.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between mb-4 text-sm text-muted-foreground">
            <div>Type: {getDocumentTypeLabel(selectedDocument.type)}</div>
            <div>Uploaded: {format(selectedDocument.dateUploaded, "MMM d, yyyy")}</div>
          </div>
          
          <div className="max-h-[60vh] overflow-auto border rounded-md p-2">
            <img 
              src={selectedDocument.url} 
              alt={selectedDocument.name}
              className="w-full object-contain"
            />
          </div>
          
          {selectedDocument.notes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">Notes:</h4>
              <p className="text-sm">{selectedDocument.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={() => selectedDocument && onDeleteDocument(selectedDocument.id)}
          >
            Delete Document
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
