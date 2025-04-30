
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Employee, EmployeeDocument, type DocumentType, DOCUMENT_TYPE } from "@/types/employee";

export const useEmployeeDocuments = (employee?: Employee) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<EmployeeDocument[]>(employee?.documents || []);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadDocument = (documentData: any) => {
    setIsUploading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      const newDocument: EmployeeDocument = {
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: documentData.name,
        url: URL.createObjectURL(documentData.file),
        uploadDate: new Date().toISOString(),
        type: documentData.type as DocumentType,
        expiryDate: documentData.expiryDate?.toISOString(),
        notes: documentData.notes,
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setIsUploading(false);
      
      toast({
        title: "Document uploaded",
        description: `${documentData.name} has been added to employee documents.`,
      });
    }, 1500);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    
    toast({
      title: "Document removed",
      description: "The document has been removed successfully."
    });
  };

  return {
    documents,
    isUploading,
    handleUploadDocument,
    handleDeleteDocument
  };
};
