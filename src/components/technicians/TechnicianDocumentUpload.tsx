import React from 'react';
import { Technician, Document } from '@/types/technician';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, File, FileText, Image, Link, Loader2, Plus, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface FileUploadProps {
  title: string;
  type: string;
  size: number;
  url: string;
}

const TechnicianDocumentUpload = ({ technician, onUpdate }: { technician: Technician, onUpdate: (tech: Technician) => void }) => {
  // Ensure documents property exists and is properly typed
  const initialDocuments: Document[] = technician.documents || [];
  
  // Fix the document structure to include the required 'name' property
  const documentsList: Document[] = initialDocuments.map(doc => {
    return {
      ...doc,
      name: doc.title || doc.name || 'Unnamed Document' // Ensure name exists
    };
  });
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [fileUpload, setFileUpload] = React.useState<FileUploadProps>({
    title: "",
    type: "",
    size: 0,
    url: ""
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    // Simulate actual upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setFileUpload({
      title: file.name,
      type: file.type,
      size: file.size,
      url: "https://example.com/uploaded-file.pdf", // Replace with actual URL
    });

    setUploading(false);
    setIsDialogOpen(true);
  };

  // Fix document creation to include name
  const handleAddDocument = (document: { title: string, type: string, size: number, url: string }) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: document.title, // Set name property
      title: document.title,
      type: document.type,
      size: document.size,
      uploadDate: new Date().toISOString().split('T')[0],
      url: document.url
    };
    
    // Update technician with proper documents array
    const updatedTechnician: Technician = {
      ...technician,
      documents: [...(technician.documents || []), newDocument]
    };
    
    onUpdate(updatedTechnician);
    
    toast.success("Document added successfully");
    setIsDialogOpen(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    const updatedTechnician: Technician = {
      ...technician,
      documents: technician.documents?.filter(doc => doc.id !== documentId)
    };
    
    onUpdate(updatedTechnician);
    
    toast.success("Document deleted successfully");
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  // Fix license number access to handle both string and object types
  const getLicenseNumber = (license: string | { number: string; state: string; expirationDate: string }) => {
    if (typeof license === 'string') {
      return license;
    }
    return license?.number || '';
  };
  
  const getLicenseState = (license: string | { number: string; state: string; expirationDate: string }) => {
    if (typeof license === 'string') {
      return '';
    }
    return license?.state || '';
  };
  
  const getLicenseExpiration = (license: string | { number: string; state: string; expirationDate: string }) => {
    if (typeof license === 'string') {
      return '';
    }
    return license?.expirationDate || '';
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsList.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.size} KB</TableCell>
                  <TableCell>{document.uploadDate}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyLink(document.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteDocument(document.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2 h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {documentsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No documents uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
          />
          {uploading && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>License Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                type="text"
                id="licenseNumber"
                value={getLicenseNumber(technician.licenseNumber)}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="licenseState">License State</Label>
              <Input
                type="text"
                id="licenseState"
                value={getLicenseState(technician.licenseNumber)}
                readOnly
              />
            </div>
          </div>
          <div>
            <Label htmlFor="licenseExpiration">License Expiration</Label>
            <Input
              type="text"
              id="licenseExpiration"
              value={getLicenseExpiration(technician.licenseNumber)}
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog for adding document details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Document Details</DialogTitle>
            <DialogDescription>
              Enter the details for the uploaded document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                defaultValue={fileUpload.title}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                type="text"
                id="type"
                defaultValue={fileUpload.type}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Input
                type="text"
                id="size"
                defaultValue={`${fileUpload.size} KB`}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                type="text"
                id="url"
                defaultValue={fileUpload.url}
                className="col-span-3"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleAddDocument(fileUpload)}>
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianDocumentUpload;
