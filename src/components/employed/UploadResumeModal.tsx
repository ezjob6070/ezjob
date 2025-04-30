import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Resume, RESUME_STATUS } from "@/types/employee";
import { Upload } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

type UploadResumeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadResume: (resume: Resume) => void;
};

const UploadResumeModal = ({ open, onOpenChange, onUploadResume }: UploadResumeModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    education: "",
    notes: "",
    resumeUrl: "",
    coverLetterUrl: "",
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      
      // In a real app, you would upload this to a server and get a URL
      // For demo purposes, we'll create a temporary object URL
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, resumeUrl: fileUrl }));
    }
  };
  
  const handleCoverLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverLetterFile(file);
      
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, coverLetterUrl: fileUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position || !formData.resumeUrl) {
      toast({
        title: "Error",
        description: "Please fill all required fields and upload a resume",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toISOString();
    
    const newResume: Resume = {
      id: `resume-${uuidv4().slice(0, 8)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      experience: formData.experience,
      education: formData.education || undefined,
      status: RESUME_STATUS.NEW,
      submittedDate: currentDate,
      resumeUrl: formData.resumeUrl,
      coverLetterUrl: formData.coverLetterUrl || undefined,
      notes: formData.notes || undefined,
      dateSubmitted: currentDate,
    };

    onUploadResume(newResume);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      education: "",
      notes: "",
      resumeUrl: "",
      coverLetterUrl: "",
    });
    setResumeFile(null);
    setCoverLetterFile(null);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload New Resume</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Candidate Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position Applied For</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education (Optional)</Label>
              <Input
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleResumeUpload}
              placeholder="/resumes/resume-file.pdf"
            />
            <p className="text-xs text-muted-foreground">
              In a real app, you would upload a file here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetterUrl">Cover Letter URL</Label>
            <Input
              id="coverLetterUrl"
              name="coverLetterUrl"
              value={formData.coverLetterUrl}
              onChange={handleCoverLetterUpload}
              placeholder="/resumes/cover-letter-file.pdf"
            />
            <p className="text-xs text-muted-foreground">
              In a real app, you would upload a file here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the candidate..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
