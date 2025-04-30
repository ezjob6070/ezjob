
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Resume, RESUME_STATUS } from "@/types/employee";

interface UploadResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadResume: (resume: Resume) => void;
}

const UploadResumeModal = ({
  open,
  onOpenChange,
  onUploadResume
}: UploadResumeModalProps) => {
  const [resumeData, setResumeData] = useState({
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    education: "",
    resumeUrl: "",
    notes: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResume: Resume = {
      id: `resume-${uuidv4()}`,
      name: resumeData.candidateName,
      candidateName: resumeData.candidateName,
      email: resumeData.email,
      phone: resumeData.phone,
      position: resumeData.position,
      experience: resumeData.experience,
      education: resumeData.education || undefined,
      status: RESUME_STATUS.NEW,
      dateSubmitted: new Date().toISOString(),
      submittedDate: new Date().toISOString(),
      resumeUrl: resumeData.resumeUrl || "/resumes/sample-resume.pdf",
      notes: resumeData.notes
    };
    
    onUploadResume(newResume);
    setResumeData({
      candidateName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      education: "",
      resumeUrl: "",
      notes: ""
    });
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
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input
                id="candidateName"
                name="candidateName"
                value={resumeData.candidateName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={resumeData.email}
                onChange={handleInputChange}
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
                value={resumeData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position Applied For</Label>
              <Input
                id="position"
                name="position"
                value={resumeData.position}
                onChange={handleInputChange}
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
                value={resumeData.experience}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education (Optional)</Label>
              <Input
                id="education"
                name="education"
                value={resumeData.education}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              name="resumeUrl"
              value={resumeData.resumeUrl}
              onChange={handleInputChange}
              placeholder="/resumes/resume-file.pdf"
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
              value={resumeData.notes}
              onChange={handleInputChange}
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
