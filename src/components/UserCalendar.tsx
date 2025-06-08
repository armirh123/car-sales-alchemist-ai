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
  Trash2,
  Filter,
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarDays,
  Users,
  Target,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isThisWeek, addDays, startOfWeek, endOfWeek } from "date-fns";
import UpcomingAppointmentsPopup from "./UpcomingAppointmentsPopup";

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
  priority: "low" | "medium" | "high";
}

const UserCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const { toast } = useToast();

  // Sample appointments for demonstration
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Test Drive - Honda Civic",
      description: "Customer interested in 2024 Honda Civic Sport",
      date: new Date(),
      time: "10:00 AM",
      type: "test_drive",
      client: "John Smith",
      phone: "(555) 123-4567",
      location: "Main Lot",
      status: "scheduled",
      priority: "high"
    },
    {
      id: "2",
      title: "Follow-up Call - Sarah Johnson",
      description: "Discussing financing options",
      date: addDays(new Date(), 1),
      time: "2:00 PM",
      type: "follow_up",
      client: "Sarah Johnson",
      phone: "(555) 987-6543",
      status: "scheduled",
      priority: "medium"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
    type: "meeting",
    client: "",
    phone: "",
    location: "",
    priority: "medium"
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(apt => apt.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    return filtered;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'test_drive': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow_up': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'service': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      status: "scheduled",
      priority: newEvent.priority as Appointment['priority']
    };

    setAppointments([...appointments, appointment]);
    setNewEvent({
      title: "",
      description: "",
      time: "",
      type: "meeting",
      client: "",
      phone: "",
      location: "",
      priority: "medium"
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

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast({
      title: "Status Updated",
      description: `Appointment marked as ${newStatus}`
    });
  };

  const todayAppointments = getAppointmentsForDate(new Date());
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];
  const weekAppointments = appointments.filter(apt => isThisWeek(apt.date));
  const upcomingAppointments = appointments.filter(apt => apt.date > new Date()).slice(0, 5);

  // Calendar stats
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;
  const totalToday = todayAppointments.length;
  const testDrivesThisWeek = weekAppointments.filter(apt => apt.type === 'test_drive').length;
  const completionRate = appointments.length > 0 
    ? Math.round((appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <UpcomingAppointmentsPopup appointments={appointments} />
      
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Calendar & Appointments</h2>
          <p className="text-slate-600 mt-1">Manage your schedule and client meetings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
                <div className="grid grid-cols-2 gap-3">
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newEvent.priority} onValueChange={(value) => setNewEvent({...newEvent, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Select value={newEvent.time} onValueChange={(value) => setNewEvent({...newEvent, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="9:30 AM">9:30 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                      <SelectItem value="1:30 PM">1:30 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="3:30 PM">3:30 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                      <SelectItem value="4:30 PM">4:30 PM</SelectItem>
                      <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
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
                    rows={3}
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
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{completedToday}/{totalToday}</p>
                <p className="text-xs text-slate-500 mt-1">Completed</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <p className="text-2xl font-bold text-slate-900">{weekAppointments.length}</p>
                <p className="text-xs text-slate-500 mt-1">Appointments</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarDays className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Test Drives</p>
                <p className="text-2xl font-bold text-slate-900">{testDrivesThisWeek}</p>
                <p className="text-xs text-slate-500 mt-1">This week</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
                <p className="text-xs text-slate-500 mt-1">Overall</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search appointments or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="test_drive">Test Drives</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="follow_up">Follow-ups</SelectItem>
                <SelectItem value="delivery">Deliveries</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Week
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Click on a date to view and manage appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasAppointment: appointments.map(apt => apt.date)
                }}
                modifiersStyles={{
                  hasAppointment: { 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Date Appointments */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {isToday(selectedDate) ? "Today's Appointments" :
                     isTomorrow(selectedDate) ? "Tomorrow's Appointments" :
                     `Appointments for ${format(selectedDate, 'EEEE, MMMM d')}`}
                  </span>
                  <Badge variant="secondary">
                    {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No appointments scheduled for this date</p>
                    <Button onClick={() => setIsAddingEvent(true)} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              <h4 className="font-semibold text-lg">{appointment.title}</h4>
                              <Badge className={getTypeColor(appointment.type)}>
                                {appointment.type.replace('_', ' ')}
                              </Badge>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              <Badge className={getPriorityColor(appointment.priority)}>
                                {appointment.priority} priority
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
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
                            </div>
                            {appointment.description && (
                              <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">{appointment.description}</p>
                            )}
                          </div>
                          <div className="flex flex-col space-y-1 ml-4">
                            {appointment.status === 'scheduled' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleStatusChange(appointment.id, 'completed')}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteEvent(appointment.id)}
                              className="text-red-600 hover:bg-red-50"
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Today's Summary</span>
              </CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
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
                    <div key={appointment.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{appointment.title}</span>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
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

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Upcoming</span>
              </CardTitle>
              <CardDescription>Next 5 appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No upcoming appointments</p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{appointment.client}</p>
                        <p className="text-xs text-slate-500">{format(appointment.date, 'MMM d')} at {appointment.time}</p>
                      </div>
                      <Badge className={getTypeColor(appointment.type)} variant="outline">
                        {appointment.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => setIsAddingEvent(true)} className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Test Drive
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Follow-up Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Schedule Delivery
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;
