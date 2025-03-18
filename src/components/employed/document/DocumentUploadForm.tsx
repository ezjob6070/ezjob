
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DocumentType } from "@/types/employee";

interface DocumentUploadFormProps {
  newDocument: {
    type: DocumentType;
    name: string;
    notes: string;
    expiryDate: string;
  };
  setNewDocument: React.Dispatch<React.SetStateAction<{
    type: DocumentType;
    name: string;
    notes: string;
    expiryDate: string;
  }>>;
  onCancel: () => void;
}

const DocumentUploadForm = ({ 
  newDocument, 
  setNewDocument, 
  onCancel 
}: DocumentUploadFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select 
            value={newDocument.type} 
            onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value as DocumentType }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DocumentType.ID}>ID Card</SelectItem>
              <SelectItem value={DocumentType.PASSPORT}>Passport</SelectItem>
              <SelectItem value={DocumentType.DRIVERS_LICENSE}>Driver's License</SelectItem>
              <SelectItem value={DocumentType.WORK_PERMIT}>Work Permit</SelectItem>
              <SelectItem value={DocumentType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="documentName">Document Name</Label>
          <Input
            id="documentName"
            value={newDocument.name}
            onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
            placeholder="E.g., National ID Card"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
          <Input
            id="expiryDate"
            type="date"
            value={newDocument.expiryDate}
            onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDate: e.target.value }))}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={newDocument.notes}
            onChange={(e) => setNewDocument(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any additional information about this document"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="documentFile">Upload File</Label>
          <Input
            id="documentFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="text-xs text-muted-foreground">
            Accepted formats: PDF, JPG, PNG
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
