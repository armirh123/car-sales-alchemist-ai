
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  interest: string;
  status: string;
  lastContact: string;
  value: string;
}

interface AddLeadDialogProps {
  onAddLead: (lead: Lead) => void;
}

const AddLeadDialog = ({ onAddLead }: AddLeadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    interest: "",
    status: "warm",
    value: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contact || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newLead: Lead = {
      id: Date.now(),
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      interest: formData.interest || "General Inquiry",
      status: formData.status,
      lastContact: "Just added",
      value: formData.value || "$0"
    };

    onAddLead(newLead);
    
    toast({
      title: "Success",
      description: "Lead added successfully"
    });

    setFormData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      interest: "",
      status: "warm",
      value: ""
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Add a new lead to your sales pipeline
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g., Johnson Motors"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="contact">Contact Person *</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({...prev, contact: e.target.value}))}
              placeholder="e.g., Sarah Johnson"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              placeholder="email@company.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              placeholder="(555) 123-4567"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="interest">Interest</Label>
            <Input
              id="interest"
              value={formData.interest}
              onChange={(e) => setFormData(prev => ({...prev, interest: e.target.value}))}
              placeholder="e.g., Luxury Sedans"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="value">Estimated Value</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({...prev, value: e.target.value}))}
              placeholder="e.g., $125,000"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
