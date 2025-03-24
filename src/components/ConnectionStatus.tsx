
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { checkServerConnection } from '@/lib/api';
import { toast } from 'sonner';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const checkConnection = async () => {
    try {
      const connected = await checkServerConnection();
      setIsConnected(connected);
      setConnectionError(null);
      if (!connected) {
        toast.error('Cannot connect to the backend server. Make sure it\'s running on http://localhost:5000 and has the proper API endpoints configured.');
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
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
    <div className={`fixed bottom-4 right-4 p-3 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'} shadow-md z-50 flex items-center justify-center transition-all duration-300`}>
      {isConnected ? (
        <Wifi className="h-5 w-5 text-green-600" />
      ) : (
        <div className="flex items-center">
          <WifiOff className="h-5 w-5 text-red-600" />
          <span className="text-xs ml-2 text-red-600 hidden md:inline">
            Backend not connected
            {connectionError && <span className="block text-xs opacity-75">{connectionError}</span>}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
