
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection restored",
        description: "You're back online. Syncing pending changes..."
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection lost",
        description: "Working offline. Changes will sync when connection is restored.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingAction = (type: string, data: any) => {
    const action: OfflineAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      timestamp: Date.now()
    };

    setPendingActions(prev => [...prev, action]);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('pendingActions');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('pendingActions', JSON.stringify([...existing, action]));
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    try {
      // In a real app, you'd sync with your backend here
      console.log('Syncing pending actions:', pendingActions);
      
      // Clear pending actions after successful sync
      setPendingActions([]);
      localStorage.removeItem('pendingActions');
      
      toast({
        title: "Sync complete",
        description: `${pendingActions.length} changes synced successfully`
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync pending changes. Will retry when connection improves.",
        variant: "destructive"
      });
    }
  };

  return {
    isOnline,
    pendingActions: pendingActions.length,
    addPendingAction,
    syncPendingActions
  };
}
