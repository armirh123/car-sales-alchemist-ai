import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  User, 
  Car, 
  Phone,
  MapPin,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: "test_drive" | "meeting" | "follow_up" | "delivery" | "service";
  client: string;
  phone?: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const UserCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const { toast } = useToast();

  // Start with empty appointments - users will add their own data
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
    type: "meeting",
    client: "",
    phone: "",
    location: ""
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'test_drive': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'follow_up': return 'bg-orange-100 text-orange-800';
      case 'delivery': return 'bg-purple-100 text-purple-800';
      case 'service': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.client || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time || "9:00 AM",
      type: newEvent.type as Appointment['type'],
      client: newEvent.client,
      phone: newEvent.phone,
      location: newEvent.location,
      status: "scheduled"
    };

    setAppointments([...appointments, appointment]);
    setNewEvent({
      title: "",
      description: "",
      time: "",
      type: "meeting",
      client: "",
      phone: "",
      location: ""
    });
    setIsAddingEvent(false);

    toast({
      title: "Event Added",
      description: "Your appointment has been scheduled successfully"
    });
  };

  const handleDeleteEvent = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    toast({
      title: "Event Deleted",
      description: "The appointment has been removed"
    });
  };

  const todayAppointments = getAppointmentsForDate(new Date());
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Calendar & Appointments</h2>
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Add a new appointment or meeting to your calendar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g., Test Drive - Honda Civic"
                />
              </div>
              <div>
                <Label htmlFor="client">Client Name *</Label>
                <Input
                  id="client"
                  value={newEvent.client}
                  onChange={(e) => setNewEvent({...newEvent, client: e.target.value})}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test_drive">Test Drive</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="delivery">Vehicle Delivery</SelectItem>
                    <SelectItem value="service">Service Appointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  placeholder="e.g., 10:00 AM"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEvent.phone}
                  onChange={(e) => setNewEvent({...newEvent, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="e.g., Dealership Lot"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddEvent} className="flex-1">
                  Add Appointment
                </Button>
                <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendar</span>
              </CardTitle>
              <CardDescription>
                Select a date to view appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Selected Date Appointments */}
          {selectedDate && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Appointments for {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No appointments scheduled for this date</p>
                    <Button onClick={() => setIsAddingEvent(true)} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{appointment.title}</h4>
                              <Badge className={getTypeColor(appointment.type)}>
                                {appointment.type.replace('_', ' ')}
                              </Badge>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-slate-600">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{appointment.client}</span>
                              </div>
                              {appointment.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{appointment.phone}</span>
                                </div>
                              )}
                              {appointment.location && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                              {appointment.description && (
                                <p className="mt-2">{appointment.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteEvent(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Today's Appointments Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Appointments</CardTitle>
              <CardDescription>
                {todayAppointments.length} appointment(s) today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-slate-500 mb-4">No appointments today</p>
                  <Button onClick={() => setIsAddingEvent(true)} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{appointment.title}</span>
                        <Badge className={getTypeColor(appointment.type)}>
                          {appointment.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{appointment.client}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>This Week</span>
                <span className="font-medium">{appointments.filter(apt => {
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return apt.date >= new Date() && apt.date <= weekFromNow;
                }).length} appointments</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Test Drives</span>
                <span className="font-medium">{appointments.filter(apt => apt.type === 'test_drive').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Follow-ups</span>
                <span className="font-medium">{appointments.filter(apt => apt.type === 'follow_up').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;
