
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DOCUMENT_TYPE } from "@/types/employee";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DocumentUploadFormProps {
  onSubmit: (documentData: any) => Promise<void>;
  onCancel: () => void;
}

const DocumentUploadForm = ({ onSubmit, onCancel }: DocumentUploadFormProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!name) {
        setName(e.target.files[0].name);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!name) {
        setError("Document name is required");
        return;
      }
      
      setIsSubmitting(true);
      
      // In a real app, you would upload the file to storage here
      // and get back a URL. For this demo, we'll create a placeholder URL
      
      const documentData = {
        name,
        type: type || DOCUMENT_TYPE.OTHER,
        url: file ? URL.createObjectURL(file) : "/documents/placeholder.pdf",
        notes,
        expiryDate: expiryDate ? expiryDate.toISOString() : undefined,
      };
      
      await onSubmit(documentData);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("An error occurred while uploading the document");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Document Name</Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter document name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Document Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Document Types</SelectLabel>
                <SelectItem value={DOCUMENT_TYPE.ID}>ID Document</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.RESUME}>Resume</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.CERTIFICATE}>Certificate</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.CONTRACT}>Contract</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.PASSPORT}>Passport</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.DRIVERS_LICENSE}>Driver's License</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.WORK_PERMIT}>Work Permit</SelectItem>
                <SelectItem value={DOCUMENT_TYPE.OTHER}>Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file">Document File</Label>
        <div className="border-2 border-dashed rounded-md p-4">
          <div className="flex items-center justify-center flex-col">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-center text-gray-500 mb-2">
              {file ? file.name : "Click to upload or drag and drop"}
            </p>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file')?.click()}
            >
              Select File
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiry-date">Expiry Date (optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="expiry-date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !expiryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={expiryDate}
              onSelect={setExpiryDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any additional information about this document"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploadForm;
