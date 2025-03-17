import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Resume, ResumeStatus } from "@/types/employee";

interface UploadResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadResume: (resume: Resume) => void;
}

const UploadResumeModal = ({ open, onOpenChange, onUploadResume }: UploadResumeModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    notes: "",
    resumeUrl: "/path/to/resume.pdf",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new resume object
    const currentDate = new Date();
    const newResume: Resume = {
      id: `res-${Date.now()}`,
      name: formData.name,
      candidateName: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      experience: formData.experience,
      status: ResumeStatus.PENDING,
      dateSubmitted: currentDate.toISOString(),
      resumeUrl: formData.resumeUrl,
      notes: formData.notes,
    };

    onUploadResume(newResume);
    
    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      notes: "",
      resumeUrl: "/path/to/resume.pdf",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position Applied For *</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Software Developer"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="5 years"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="resume" className="block">Resume File</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="cursor-pointer"
                onChange={() => {
                  // In a real app, this would handle file upload
                  // and set the resume URL from the response
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload a PDF, DOC, or DOCX file (max 5MB)
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the candidate..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Resume</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeModal;
