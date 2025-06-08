
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Users, 
  MessageCircle, 
  Circle,
  Phone,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  metadata?: any;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface ChatChannel {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const TeamChat = () => {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userPresence, setUserPresence] = useState<UserPresence[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser();
    fetchChannels();
    fetchUserPresence();
    updateUserPresence('online');
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from('chat_channels')
      .select('*')
      .order('created_at');
    
    if (error) {
      console.error('Error fetching channels:', error);
      return;
    }

    setChannels(data || []);
    if (data && data.length > 0 && !activeChannel) {
      setActiveChannel(data[0].id);
    }
  };

  const fetchMessages = async () => {
    if (!activeChannel) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles (
          first_name,
          last_name
        )
      `)
      .eq('channel_id', activeChannel)
      .order('created_at');

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const fetchUserPresence = async () => {
    const { data, error } = await supabase
      .from('user_presence')
      .select(`
        *,
        profiles (
          first_name,
          last_name
        )
      `);

    if (error) {
      console.error('Error fetching user presence:', error);
      return;
    }

    setUserPresence(data || []);
  };

  const updateUserPresence = async (status: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        status,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating presence:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${activeChannel}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel || !currentUser) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        channel_id: activeChannel,
        user_id: currentUser.id,
        content: newMessage.trim(),
        message_type: 'text'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return;
    }

    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-[600px] flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r">
        <Tabs defaultValue="channels" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channels">
              <MessageCircle className="h-4 w-4 mr-2" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="channels" className="h-full mt-0">
            <ScrollArea className="h-[520px]">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    activeChannel === channel.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <div className="font-medium">#{channel.name}</div>
                  {channel.description && (
                    <div className="text-sm text-gray-500">{channel.description}</div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="users" className="h-full mt-0">
            <ScrollArea className="h-[520px]">
              {userPresence.map((user) => (
                <div key={user.user_id} className="p-3 flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user.profiles?.first_name?.charAt(0) || 'U'}
                    </div>
                    <Circle
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`}
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {user.profiles?.first_name} {user.profiles?.last_name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{user.status}</div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold">
            #{channels.find(c => c.id === activeChannel)?.name || 'Select a channel'}
          </h3>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">
                  {message.profiles?.first_name} {message.profiles?.last_name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.created_at)}
                </span>
              </div>
              <div className="text-sm">{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
