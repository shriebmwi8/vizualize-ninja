
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { checkServerConnection } from '@/lib/api';
import { toast } from 'sonner';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  const checkConnection = async () => {
    try {
      const connected = await checkServerConnection();
      setIsConnected(connected);
      if (!connected) {
        toast.error('Cannot connect to the backend server. Make sure it\'s running on http://localhost:5000');
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
    
    // Check connection periodically
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  if (isConnected === null) {
    return null; // Still checking
  }
  
  return (
    <div className={`fixed bottom-4 right-4 p-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
      {isConnected ? (
        <Wifi className="h-5 w-5 text-green-600" />
      ) : (
        <WifiOff className="h-5 w-5 text-red-600" />
      )}
    </div>
  );
};

export default ConnectionStatus;
