
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  BellRing, 
  Check, 
  X, 
  Clock, 
  User, 
  Car, 
  Mail, 
  Phone,
  Calendar,
  AlertCircle,
  Settings,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "lead" | "appointment" | "task" | "system" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean;
}

const UserNotifications = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");
  const { toast } = useToast();

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "appointment",
      title: "Upcoming Test Drive",
      message: "Test drive with John Smith for Honda Civic in 1 hour",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "2",
      type: "lead",
      title: "New Lead Assigned",
      message: "Sarah Johnson is interested in Toyota Camry. Follow up required.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: "medium",
      actionRequired: true
    },
    {
      id: "3",
      type: "reminder",
      title: "Follow-up Reminder",
      message: "Follow up with Mike Davis regarding the Ford F-150 inquiry",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      priority: "medium"
    },
    {
      id: "4",
      type: "system",
      title: "Inventory Update",
      message: "5 new vehicles added to inventory. Check the latest arrivals.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      priority: "low"
    },
    {
      id: "5",
      type: "task",
      title: "Monthly Report Due",
      message: "Your monthly sales report is due in 2 days",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: false,
      priority: "medium",
      actionRequired: true
    }
  ]);

  // Notification preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    leadNotifications: true,
    inventoryUpdates: false,
    systemAlerts: true
  });

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    switch (filter) {
      case "unread":
        filtered = notifications.filter(n => !n.read);
        break;
      case "high":
        filtered = notifications.filter(n => n.priority === "high");
        break;
      default:
        filtered = notifications;
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'lead': return User;
      case 'task': return Clock;
      case 'system': return Settings;
      case 'reminder': return Bell;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-green-100 text-green-800';
      case 'task': return 'bg-orange-100 text-orange-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'reminder': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated"
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed"
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({notifications.length})
            </Button>
            <Button 
              variant={filter === "unread" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button 
              variant={filter === "high" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("high")}
            >
              High Priority ({notifications.filter(n => n.priority === "high").length})
            </Button>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No notifications found</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getTypeIcon(notification.type);
                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-colors ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 rounded-lg bg-slate-100">
                            <Icon className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <Badge className={getTypeColor(notification.type)} size="sm">
                                {notification.type}
                              </Badge>
                              <Badge className={getPriorityColor(notification.priority)} size="sm">
                                {notification.priority}
                              </Badge>
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-red-600 border-red-200">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                            <p className="text-xs text-slate-400">{formatTimeAgo(notification.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Customize your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, emailNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, pushNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="text-sm">SMS Notifications</Label>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, smsNotifications: checked})
                    }
                  />
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Notification Types</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="appointment-reminders" className="text-sm">Appointment Reminders</Label>
                  <Switch
                    id="appointment-reminders"
                    checked={preferences.appointmentReminders}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, appointmentReminders: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lead-notifications" className="text-sm">New Lead Alerts</Label>
                  <Switch
                    id="lead-notifications"
                    checked={preferences.leadNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, leadNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="inventory-updates" className="text-sm">Inventory Updates</Label>
                  <Switch
                    id="inventory-updates"
                    checked={preferences.inventoryUpdates}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, inventoryUpdates: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-alerts" className="text-sm">System Alerts</Label>
                  <Switch
                    id="system-alerts"
                    checked={preferences.systemAlerts}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, systemAlerts: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Today's Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <User className="h-4 w-4 mr-2" />
                Check New Leads
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Car className="h-4 w-4 mr-2" />
                Browse Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Follow-up Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Notifications</span>
                <span className="font-medium">{notifications.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Unread</span>
                <span className="font-medium text-red-600">{unreadCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High Priority</span>
                <span className="font-medium text-orange-600">
                  {notifications.filter(n => n.priority === "high").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Action Required</span>
                <span className="font-medium text-blue-600">
                  {notifications.filter(n => n.actionRequired).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
