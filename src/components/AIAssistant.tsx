
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Lightbulb, TrendingUp, Target } from "lucide-react";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm your AI sales assistant. I can help you with lead analysis, sales strategies, market insights, and more. What would you like to know?",
      timestamp: "Just now"
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: "user",
      content: message,
      timestamp: "Just now"
    };

    // Simulate AI response
    const aiResponses = [
      "Based on your current leads, I recommend focusing on Johnson Motors this week. They've shown strong interest in luxury sedans and have a high conversion probability.",
      "Market analysis shows that electric vehicle demand is up 34% in your region. Consider expanding your EV inventory.",
      "Your conversion rate for Tuesday calls is 18% higher than average. I suggest scheduling important lead calls on Tuesdays.",
      "Metro Auto Group hasn't been contacted in a week. Based on their interest profile, I recommend sending them information about our new electric vehicle lineup.",
      "Analysis of successful deals shows that dealerships prefer detailed ROI projections. I can help you create customized presentations."
    ];

    const botMessage = {
      type: "bot",
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      timestamp: "Just now"
    };

    setMessages([...messages, userMessage, botMessage]);
    setMessage("");
  };

  const quickActions = [
    { label: "Analyze Hot Leads", icon: TrendingUp },
    { label: "Market Insights", icon: Lightbulb },
    { label: "Sales Strategy", icon: Target }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Sales Assistant</h2>
          <p className="text-slate-600">Get intelligent insights and recommendations</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <Bot className="h-4 w-4 mr-1" />
          Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span>Chat Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {msg.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                        {msg.type === 'user' && <User className="h-4 w-4 mt-0.5" />}
                        <div>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me about leads, sales strategies, or market insights..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common AI assistant tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setMessage(action.label)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Lead scoring & prioritization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Market trend analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sales strategy recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Automated follow-up suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Performance optimization</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
