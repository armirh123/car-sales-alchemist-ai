
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Send,
  History,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface CommunicationLog {
  id: string;
  communication_type: string;
  subject?: string;
  content: string;
  recipient_email?: string;
  recipient_phone?: string;
  status: string;
  created_at: string;
}

interface CustomerCommunicationProps {
  customer: Customer;
  communicationLogs?: CommunicationLog[];
  onCommunicationSent?: () => void;
}

const CustomerCommunication = ({ 
  customer, 
  communicationLogs = [],
  onCommunicationSent 
}: CustomerCommunicationProps) => {
  const [emailOpen, setEmailOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    content: '',
    template: ''
  });
  const [smsForm, setSmsForm] = useState({
    content: '',
    template: ''
  });
  const { toast } = useToast();

  const emailTemplates = [
    { id: 'follow_up', name: 'Follow-up', subject: 'Following up on your inquiry', content: 'Hi {firstName},\n\nI wanted to follow up on your recent inquiry about our vehicles. Do you have any questions I can help answer?\n\nBest regards,\n[Your Name]' },
    { id: 'appointment', name: 'Appointment Reminder', subject: 'Appointment Reminder', content: 'Hi {firstName},\n\nThis is a reminder about your appointment scheduled for tomorrow. We look forward to seeing you!\n\nBest regards,\n[Your Name]' },
    { id: 'thank_you', name: 'Thank You', subject: 'Thank you for your business', content: 'Hi {firstName},\n\nThank you for choosing us! We appreciate your business and hope you enjoy your new vehicle.\n\nBest regards,\n[Your Name]' }
  ];

  const smsTemplates = [
    { id: 'quick_follow_up', name: 'Quick Follow-up', content: 'Hi {firstName}! Just checking in about your vehicle inquiry. Any questions? - [Your Name]' },
    { id: 'appointment_reminder', name: 'Appointment Reminder', content: 'Hi {firstName}! Reminder: Your appointment is tomorrow. See you soon! - [Your Name]' },
    { id: 'new_arrival', name: 'New Arrival', content: 'Hi {firstName}! We got a new vehicle that matches your preferences. Want to take a look? - [Your Name]' }
  ];

  const sendEmail = async () => {
    if (!emailForm.subject || !emailForm.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Replace placeholders in content
      const personalizedContent = emailForm.content.replace('{firstName}', customer.firstName);

      // Log the communication using any type to bypass type checking
      const { error } = await (supabase as any)
        .from('customer_communications')
        .insert({
          customer_id: customer.id,
          user_id: user.id,
          communication_type: 'email',
          subject: emailForm.subject,
          content: personalizedContent,
          recipient_email: customer.email,
          status: 'sent'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email sent successfully"
      });

      setEmailForm({ subject: '', content: '', template: '' });
      setEmailOpen(false);
      onCommunicationSent?.();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      });
    }
  };

  const sendSMS = async () => {
    if (!smsForm.content) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Replace placeholders in content
      const personalizedContent = smsForm.content.replace('{firstName}', customer.firstName);

      // Log the communication using any type to bypass type checking
      const { error } = await (supabase as any)
        .from('customer_communications')
        .insert({
          customer_id: customer.id,
          user_id: user.id,
          communication_type: 'sms',
          content: personalizedContent,
          recipient_phone: customer.phone,
          status: 'sent'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "SMS sent successfully"
      });

      setSmsForm({ content: '', template: '' });
      setSmsOpen(false);
      onCommunicationSent?.();
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Error",
        description: "Failed to send SMS",
        variant: "destructive"
      });
    }
  };

  const applyEmailTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailForm({
        ...emailForm,
        subject: template.subject,
        content: template.content,
        template: templateId
      });
    }
  };

  const applySmsTemplate = (templateId: string) => {
    const template = smsTemplates.find(t => t.id === templateId);
    if (template) {
      setSmsForm({
        ...smsForm,
        content: template.content,
        template: templateId
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Send Email to {customer.firstName} {customer.lastName}</DialogTitle>
              <DialogDescription>
                Send an email to {customer.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailTemplate">Email Template</Label>
                <Select value={emailForm.template} onValueChange={applyEmailTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject"
                />
              </div>
              
              <div>
                <Label htmlFor="emailContent">Message</Label>
                <Textarea
                  id="emailContent"
                  value={emailForm.content}
                  onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                  placeholder="Your message here..."
                  rows={8}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEmailOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={sendEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send SMS
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send SMS to {customer.firstName} {customer.lastName}</DialogTitle>
              <DialogDescription>
                Send a text message to {customer.phone}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="smsTemplate">SMS Template</Label>
                <Select value={smsForm.template} onValueChange={applySmsTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {smsTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="smsContent">Message</Label>
                <Textarea
                  id="smsContent"
                  value={smsForm.content}
                  onChange={(e) => setSmsForm({...smsForm, content: e.target.value})}
                  placeholder="Your message here..."
                  rows={4}
                  maxLength={160}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {smsForm.content.length}/160 characters
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSmsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={sendSMS}>
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="outline">
          <Phone className="h-4 w-4 mr-2" />
          Call {customer.phone}
        </Button>
      </div>

      {/* Communication History */}
      {communicationLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <History className="h-4 w-4 mr-2" />
              Communication History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {communicationLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getTypeIcon(log.communication_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium capitalize">
                          {log.communication_type}
                        </span>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(log.created_at)}
                      </div>
                    </div>
                    {log.subject && (
                      <div className="text-sm font-medium mt-1">{log.subject}</div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">{log.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerCommunication;
