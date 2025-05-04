
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Resume, RESUME_STATUS } from '@/types/employee';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from 'lucide-react';

export interface UploadResumeModalProps {
  open: boolean;
  onClose: () => void;
  onUploadResume?: (resume: Resume) => void;
}

const defaultResume: Partial<Resume> = {
  name: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  education: '',
  status: RESUME_STATUS.NEW,
  notes: '',
};

const UploadResumeModal: React.FC<UploadResumeModalProps> = ({ open, onClose, onUploadResume }) => {
  const [resume, setResume] = useState<Partial<Resume>>(defaultResume);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResume(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setResume(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleCoverLetterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverLetterFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast({
        title: 'Error',
        description: 'Please upload a resume file',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, you would upload the file to a server here
    // For now, we'll just create a fake URL
    const resumeUrl = resumeFile ? URL.createObjectURL(resumeFile) : '';
    const coverLetterUrl = coverLetterFile ? URL.createObjectURL(coverLetterFile) : undefined;
    const now = new Date().toISOString();
    
    const newResume: Resume = {
      ...resume,
      id: `resume-${uuidv4().slice(0, 8)}`,
      submittedDate: now,
      dateSubmitted: now,
      name: resume.name || '',
      email: resume.email || '',
      phone: resume.phone || '',
      position: resume.position || '',
      experience: resume.experience || '',
      education: resume.education || '',
      status: resume.status as RESUME_STATUS || RESUME_STATUS.NEW,
      resumeUrl,
      coverLetterUrl,
    };
    
    if (onUploadResume) {
      onUploadResume(newResume);
    }
    
    toast({
      title: 'Resume Uploaded',
      description: `Resume for ${newResume.name} has been uploaded successfully.`,
    });
    
    setResume(defaultResume);
    setResumeFile(null);
    setCoverLetterFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={resume.name}
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
                value={resume.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={resume.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position Applied For</Label>
              <Input
                id="position"
                name="position"
                value={resume.position}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={resume.experience}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                name="education"
                value={resume.education}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={resume.status?.toString()}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RESUME_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="resume" className="block mb-2">Resume File</Label>
              <div className="flex items-center">
                <label
                  htmlFor="resume"
                  className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 rounded-md p-3 flex-grow hover:bg-gray-50"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {resumeFile ? resumeFile.name : "Click to upload resume"}
                  </span>
                </label>
                <Input
                  id="resume"
                  type="file"
                  onChange={handleResumeFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="coverLetter" className="block mb-2">Cover Letter (Optional)</Label>
              <div className="flex items-center">
                <label
                  htmlFor="coverLetter"
                  className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 rounded-md p-3 flex-grow hover:bg-gray-50"
                >
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {coverLetterFile ? coverLetterFile.name : "Click to upload cover letter"}
                  </span>
                </label>
                <Input
                  id="coverLetter"
                  type="file"
                  onChange={handleCoverLetterFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={resume.notes || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes about the candidate..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Upload Resume
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeModal;
