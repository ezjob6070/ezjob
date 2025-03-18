
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EmployeeDocument, DocumentType, Employee } from "@/types/employee";

export const useEmployeeDocuments = (
  employee: Employee,
  onUpdateEmployee: (updatedEmployee: Employee) => void
) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<EmployeeDocument[]>(employee.documents || []);
  const [selectedDocument, setSelectedDocument] = useState<EmployeeDocument | null>(null);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [showViewDocumentDialog, setShowViewDocumentDialog] = useState(false);
  
  const [newDocument, setNewDocument] = useState({
    type: DocumentType.ID,
    name: "",
    notes: "",
    expiryDate: "",
  });
  
  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case DocumentType.ID: return "ID Card";
      case DocumentType.PASSPORT: return "Passport";
      case DocumentType.DRIVERS_LICENSE: return "Driver's License";
      case DocumentType.WORK_PERMIT: return "Work Permit";
      case DocumentType.OTHER: return "Other";
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const documentUrl = URL.createObjectURL(file);
      const currentDate = new Date();
      
      const newDocumentObj: EmployeeDocument = {
        id: `doc-${Date.now()}`,
        type: newDocument.type,
        name: newDocument.name || file.name,
        url: documentUrl,
        dateUploaded: currentDate.toISOString(),
        notes: newDocument.notes || undefined,
        expiryDate: newDocument.expiryDate ? new Date(newDocument.expiryDate).toISOString() : undefined,
      };
      
      const updatedDocuments = [...documents, newDocumentObj];
      setDocuments(updatedDocuments);
      
      const updatedEmployee = {
        ...employee,
        documents: updatedDocuments,
      };
      
      onUpdateEmployee(updatedEmployee);
      
      setNewDocument({
        type: DocumentType.ID,
        name: "",
        notes: "",
        expiryDate: "",
      });
      
      setShowAddDocumentDialog(false);
      
      toast({
        title: "Document Uploaded",
        description: "The document has been added to the employee's records",
      });
    }
  };
  
  const handleViewDocument = (document: EmployeeDocument) => {
    setSelectedDocument(document);
    setShowViewDocumentDialog(true);
  };
  
  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    
    const updatedEmployee = {
      ...employee,
      documents: updatedDocuments,
    };
    
    onUpdateEmployee(updatedEmployee);
    
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the employee's records",
    });
    
    if (showViewDocumentDialog && selectedDocument?.id === documentId) {
      setShowViewDocumentDialog(false);
    }
  };

  return {
    documents,
    selectedDocument,
    showAddDocumentDialog,
    showViewDocumentDialog,
    newDocument,
    getDocumentTypeLabel,
    setShowAddDocumentDialog,
    setShowViewDocumentDialog,
    setNewDocument,
    handleFileUpload,
    handleViewDocument,
    handleDeleteDocument
  };
};

export default useEmployeeDocuments;
