
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JobSource } from '@/types/jobSource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useGlobalState } from '@/components/providers/GlobalStateProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface EditJobSourceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobSource: JobSource;
}

const EditJobSourceModal = ({
  isOpen,
  onOpenChange,
  jobSource,
}: EditJobSourceModalProps) => {
  const [name, setName] = useState(jobSource.name);
  const [type, setType] = useState(jobSource.type || 'general');
  const [paymentType, setPaymentType] = useState(jobSource.paymentType || 'percentage');
  const [paymentValue, setPaymentValue] = useState(jobSource.paymentValue || 0);
  const [isActive, setIsActive] = useState(jobSource.isActive !== false);
  const [website, setWebsite] = useState(jobSource.website || '');
  const [phone, setPhone] = useState(jobSource.phone || '');
  const [email, setEmail] = useState(jobSource.email || '');
  
  const { toast } = useToast();
  const { deleteJobSource, setJobSources } = useGlobalState();

  const handleSave = () => {
    const updatedSource: JobSource = {
      ...jobSource,
      name,
      type,
      paymentType: paymentType as 'fixed' | 'percentage',
      paymentValue,
      isActive,
      active: isActive, // Make sure 'active' is also updated for compatibility
      website,
      phone,
      email
    };
    
    // Update job source in global state
    setJobSources(prev => 
      prev.map(source => source.id === jobSource.id ? updatedSource : source)
    );
    
    toast({
      title: 'Job Source Updated',
      description: `${name} has been successfully updated.`
    });
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      // Call the deleteJobSource function from global state
      deleteJobSource(jobSource.id);
      
      toast({
        title: 'Job Source Deleted',
        description: `${name} has been successfully deleted.`
      });
      
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job Source</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select job source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="paymentType">Payment Structure</Label>
            <Select value={paymentType} onValueChange={value => setPaymentType(value as 'fixed' | 'percentage')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="paymentValue">
              {paymentType === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'}
            </Label>
            <Input 
              id="paymentValue" 
              type="number"
              value={paymentValue} 
              onChange={e => setPaymentValue(parseFloat(e.target.value))} 
            />
          </div>
          
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch 
              id="isActive" 
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobSourceModal;
