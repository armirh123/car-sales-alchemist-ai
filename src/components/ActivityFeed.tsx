
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  User, 
  DollarSign, 
  MessageSquare, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  type: 'customer_added' | 'deal_moved' | 'communication_sent' | 'follow_up_due' | 'deal_closed';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  metadata?: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'activities' | 'notifications'>('activities');

  useEffect(() => {
    fetchActivities();
    fetchNotifications();
    subscribeToRealTimeUpdates();
  }, []);

  const fetchActivities = async () => {
    // Mock activities for now - in real implementation, these would come from the database
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'customer_added',
        title: 'New Customer Added',
        description: 'John Smith was added as a prospect by Sarah Johnson',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'medium',
        read: false
      },
      {
        id: '2',
        type: 'deal_moved',
        title: 'Deal Progressed',
        description: 'Emma Wilson moved from Lead to Hot Lead',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'high',
        read: false
      },
      {
        id: '3',
        type: 'communication_sent',
        title: 'Email Sent',
        description: 'Follow-up email sent to Michael Davis',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'low',
        read: true
      },
      {
        id: '4',
        type: 'follow_up_due',
        title: 'Follow-up Due',
        description: 'Lisa Chen follow-up scheduled for today',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        priority: 'high',
        read: false
      },
      {
        id: '5',
        type: 'deal_closed',
        title: 'Deal Closed',
        description: 'Robert Johnson completed purchase - $45,000',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'high',
        read: true
      }
    ];

    setActivities(mockActivities);
  };

  const fetchNotifications = async () => {
    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Team Meeting',
        message: 'Weekly sales meeting in 30 minutes',
        type: 'info',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false
      },
      {
        id: '2',
        title: 'Goal Achieved',
        message: 'Congratulations! You reached your monthly sales target',
        type: 'success',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false
      },
      {
        id: '3',
        title: 'Inventory Alert',
        message: 'Honda Civic 2023 is running low in stock',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true
      }
    ];

    setNotifications(mockNotifications);
  };

  const subscribeToRealTimeUpdates = () => {
    // Subscribe to real-time updates from communication logs
    const channel = supabase
      .channel('activity_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_communications'
        },
        (payload) => {
          // Add new communication activity
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'communication_sent',
            title: `${payload.new.communication_type.toUpperCase()} Sent`,
            description: `${payload.new.communication_type} sent to customer`,
            timestamp: new Date(payload.new.created_at),
            priority: 'medium',
            read: false
          };
          
          setActivities(prev => [newActivity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = (id: string, type: 'activity' | 'notification') => {
    if (type === 'activity') {
      setActivities(prev =>
        prev.map(activity =>
          activity.id === id ? { ...activity, read: true } : activity
        )
      );
    } else {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer_added': return <User className="h-4 w-4" />;
      case 'deal_moved': return <TrendingUp className="h-4 w-4" />;
      case 'communication_sent': return <MessageSquare className="h-4 w-4" />;
      case 'follow_up_due': return <Calendar className="h-4 w-4" />;
      case 'deal_closed': return <DollarSign className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
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

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadActivities = activities.filter(a => !a.read).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Activity & Notifications</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'activities' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('activities')}
            className="relative"
          >
            Activities
            {unreadActivities > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.5rem] h-6">
                {unreadActivities}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('notifications')}
            className="relative"
          >
            Notifications
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.5rem] h-6">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          {activeTab === 'activities' ? (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    activity.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                  }`}
                  onClick={() => markAsRead(activity.id, 'activity')}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getPriorityColor(activity.priority)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                          {!activity.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <Badge className={`${getPriorityColor(activity.priority)} text-xs mt-2`}>
                        {activity.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                  }`}
                  onClick={() => markAsRead(notification.id, 'notification')}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <Badge className={`${getNotificationTypeColor(notification.type)} text-xs mt-2`}>
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
