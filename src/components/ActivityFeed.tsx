
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  User,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'customer_added' | 'communication_sent' | 'deal_updated' | 'meeting_scheduled' | 'sale_completed';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  metadata?: any;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Mock activity data - in real implementation, this would come from the database
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'customer_added',
        title: 'New Customer Added',
        description: 'John Smith was added to the pipeline as a hot lead',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'Sarah Johnson'
      },
      {
        id: '2',
        type: 'communication_sent',
        title: 'Email Sent',
        description: 'Follow-up email sent to Emma Wilson regarding vehicle inquiry',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'Mike Chen'
      },
      {
        id: '3',
        type: 'deal_updated',
        title: 'Deal Stage Updated',
        description: 'David Brown moved from Lead to Negotiating stage',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: 'Sarah Johnson'
      },
      {
        id: '4',
        type: 'meeting_scheduled',
        title: 'Meeting Scheduled',
        description: 'Test drive appointment set with Lisa Davis for tomorrow 2 PM',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        user: 'Mike Chen'
      },
      {
        id: '5',
        type: 'sale_completed',
        title: 'Sale Completed',
        description: 'Tom Wilson purchased 2024 Honda Accord - $35,000',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        user: 'Sarah Johnson'
      },
      {
        id: '6',
        type: 'communication_sent',
        title: 'SMS Sent',
        description: 'Appointment reminder sent to Maria Garcia',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'Mike Chen'
      }
    ];

    setActivities(mockActivities);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer_added': return <User className="h-4 w-4" />;
      case 'communication_sent': return <Mail className="h-4 w-4" />;
      case 'deal_updated': return <TrendingUp className="h-4 w-4" />;
      case 'meeting_scheduled': return <Calendar className="h-4 w-4" />;
      case 'sale_completed': return <DollarSign className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'customer_added': return 'bg-blue-100 text-blue-800';
      case 'communication_sent': return 'bg-green-100 text-green-800';
      case 'deal_updated': return 'bg-orange-100 text-orange-800';
      case 'meeting_scheduled': return 'bg-purple-100 text-purple-800';
      case 'sale_completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">by {activity.user}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
