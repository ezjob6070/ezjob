
import { useState } from "react";
import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload, Download, Trash2, Plus } from "lucide-react";

interface TechnicianDocumentUploadProps {
  technician: Technician;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaded: Date;
  url: string;
}

const TechnicianDocumentUpload: React.FC<TechnicianDocumentUploadProps> = ({ technician }) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    // Sample documents for UI demo - would be empty in real app
    {
      id: "doc1",
      name: "Employment Agreement.pdf",
      type: "application/pdf",
      size: 245000,
      uploaded: new Date(2023, 5, 12),
      url: "#"
    },
    {
      id: "doc2",
      name: "Contractor Terms.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 125000,
      uploaded: new Date(2023, 6, 3),
      url: "#"
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to a server/storage
    // Here we're just simulating the addition to the documents list
    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploaded: new Date(),
      url: "#" // Would be a real URL in production
    }));
    
    setDocuments([...documents, ...newDocuments]);
    
    toast({
      title: "Documents Uploaded",
      description: `Successfully uploaded ${files.length} document(s)`,
    });
    
    // Reset file input
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    toast({
      title: "Document Deleted",
      description: "The document has been removed",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (type.includes('image')) return <FileText className="h-8 w-8 text-green-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Technician Documents</h3>
          <p className="text-sm text-muted-foreground">
            Upload agreements, certifications, and other relevant documents
          </p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            id="document-upload"
            className="sr-only"
            onChange={handleFileUpload}
            multiple
          />
          <label htmlFor="document-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </span>
            </Button>
          </label>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No documents yet</h3>
          <p className="text-muted-foreground mt-2">
            Upload employment agreements, certifications, or other documents
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <label htmlFor="document-upload" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </label>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <Card key={doc.id} className="p-4 flex items-center gap-4">
              {getDocumentIcon(doc.type)}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{doc.name}</h4>
                <div className="flex text-xs text-muted-foreground">
                  <span>{formatFileSize(doc.size)}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {doc.uploaded.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianDocumentUpload;
