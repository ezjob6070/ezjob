
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { DOCUMENT_TYPE } from "@/types/employee";
import { FileUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadFormProps {
  onUpload: (documentData: any) => void;
  onCancel: () => void;
}

const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  type: z.string().min(1, "Document type is required"),
  notes: z.string().optional(),
  expiryDate: z.string().optional(),
});

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "",
      notes: "",
      expiryDate: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      form.setValue("name", selectedFile.name);
    }
  };

  const onSubmit = (values: z.infer<typeof documentSchema>) => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    // Create document object with file URL
    // In a real app, you'd upload this to a storage service
    const documentData = {
      id: `doc-${Date.now()}`,
      name: values.name,
      type: values.type,
      notes: values.notes,
      expiryDate: values.expiryDate || null,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
      size: file.size,
      uploadedBy: "Current User", // In a real app, get from auth context
    };

    onUpload(documentData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="document">Upload Document</Label>
          <div className="flex items-center gap-2">
            <Input
              id="document"
              type="file"
              className="flex-1"
              onChange={handleFileChange}
            />
          </div>
          {file && (
            <div className="bg-muted p-2 rounded-md flex justify-between items-center">
              <div className="text-sm truncate max-w-[80%]">{file.name}</div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter document name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={DOCUMENT_TYPE.ID}>Identification</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.CONTRACT}>Employment Contract</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.CERTIFICATION}>Certification</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.LICENSE}>License</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.MEDICAL}>Medical Record</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.TAX}>Tax Document</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.EDUCATION}>Educational Document</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.RESUME}>Resume</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.PASSPORT}>Passport</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.DRIVERS_LICENSE}>Driver's License</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.WORK_PERMIT}>Work Permit</SelectItem>
                  <SelectItem value={DOCUMENT_TYPE.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date (if applicable)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any notes about this document"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-24"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-24">
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentUploadForm;
