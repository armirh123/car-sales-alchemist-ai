
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  X,
  Car,
  Bell
} from "lucide-react";
import { format, isToday, isTomorrow, isWithinInterval, startOfDay, endOfDay, addDays } from "date-fns";

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

interface UpcomingAppointmentsPopupProps {
  appointments: Appointment[];
}

const UpcomingAppointmentsPopup = ({ appointments }: UpcomingAppointmentsPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownToday, setHasShownToday] = useState(false);

  // Filter appointments for today and tomorrow
  const getUpcomingAppointments = () => {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    
    return appointments.filter(apt => 
      apt.status === 'scheduled' && 
      (isToday(apt.date) || isTomorrow(apt.date))
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const upcomingAppointments = getUpcomingAppointments();

  useEffect(() => {
    // Check if we should show the popup
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastShown = localStorage.getItem('lastShownUpcomingPopup');
    
    if (upcomingAppointments.length > 0 && lastShown !== today && !hasShownToday) {
      setIsOpen(true);
      setHasShownToday(true);
      localStorage.setItem('lastShownUpcomingPopup', today);
    }
  }, [upcomingAppointments.length, hasShownToday]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'test_drive': return <Car className="h-4 w-4" />;
      case 'delivery': return <Car className="h-4 w-4" />;
      case 'service': return <Car className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (upcomingAppointments.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Upcoming Appointments</span>
            <Badge variant="secondary">
              {upcomingAppointments.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You have {upcomingAppointments.length} appointment{upcomingAppointments.length !== 1 ? 's' : ''} coming up:
          </p>
          
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(appointment.type)}
                    <h4 className="font-semibold text-sm">{appointment.title}</h4>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge className={getTypeColor(appointment.type)} variant="outline">
                      {appointment.type.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(appointment.priority)} variant="outline">
                      {appointment.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      {isToday(appointment.date) ? 'Today' : 
                       isTomorrow(appointment.date) ? 'Tomorrow' : 
                       format(appointment.date, 'MMM d')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>{appointment.client}</span>
                  </div>
                  {appointment.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{appointment.phone}</span>
                    </div>
                  )}
                  {appointment.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{appointment.location}</span>
                    </div>
                  )}
                </div>
                
                {appointment.description && (
                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                    {appointment.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="flex space-x-2 pt-2">
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Got it!
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              View Calendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpcomingAppointmentsPopup;
