
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isValid } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { FilePlus, Download, Trash2, FileText } from "lucide-react";
import { Document } from "@/types/employee";
import { Badge } from "@/components/ui/badge";

interface EmployeeDocumentsProps {
  employeeId: string;
  documents?: Document[];
  onUpdateEmployee: (documents: Document[]) => void;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({
  employeeId,
  documents = [],
  onUpdateEmployee,
}) => {
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      if (!documentName) {
        // Set document name from filename if not already set
        setDocumentName(file.name.split(".")[0]);
      }
    }
  };

  const handleAddDocument = () => {
    if (!documentName) {
      toast({
        title: "Error",
        description: "Please enter a document name",
        variant: "destructive",
      });
      return;
    }

    if (!documentFile) {
      toast({
        title: "Error",
        description: "Please select a document to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // In a real app, you would upload the file to a server here
    // For now, we'll simulate a file upload with a timeout
    setTimeout(() => {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: documentName,
        url: URL.createObjectURL(documentFile), // This URL will only work during the current session
        uploadDate: new Date().toISOString(),
        type: documentFile.type,
        size: documentFile.size,
        uploadedBy: "Current User", // In a real app, get from auth context
      };

      const updatedDocuments = [...documents, newDocument];
      onUpdateEmployee(updatedDocuments);

      // Reset form
      setDocumentName("");
      setDocumentFile(null);
      setIsUploading(false);

      toast({
        title: "Document Uploaded",
        description: "Employee document has been added successfully",
      });
    }, 1000);
  };

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId);
    onUpdateEmployee(updatedDocuments);

    toast({
      title: "Document Removed",
      description: "The document has been removed successfully",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Determine document type from MIME type or file extension
  const getDocumentType = (doc: Document) => {
    if (!doc.type && !doc.url) return "Unknown";

    if (doc.type) {
      if (doc.type.includes("pdf")) return "PDF";
      if (doc.type.includes("image")) return "Image";
      if (doc.type.includes("word")) return "Word";
      if (doc.type.includes("excel") || doc.type.includes("sheet")) return "Excel";
    }

    // Try to determine from URL if type not available
    const url = doc.url.toLowerCase();
    if (url.endsWith(".pdf")) return "PDF";
    if (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png")) return "Image";
    if (url.endsWith(".doc") || url.endsWith(".docx")) return "Word";
    if (url.endsWith(".xls") || url.endsWith(".xlsx")) return "Excel";

    return "Unknown";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus className="h-5 w-5" />
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Document Name</label>
                <Input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Document File</label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleAddDocument}
              disabled={isUploading || !documentName || !documentFile}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Employee Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getDocumentType(doc)}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No documents added yet. Upload a document to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default EmployeeDocuments;
