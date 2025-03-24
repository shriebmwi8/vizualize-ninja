
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { checkServerConnection } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  
  const checkConnection = async () => {
    setIsChecking(true);
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
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
    
    // Check connection periodically
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  if (isConnected === null && !isChecking) {
    return null; // Still checking
  }
  
  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'} shadow-md z-50 flex items-center justify-center transition-all duration-300`}>
      {isConnected ? (
        <Wifi className="h-5 w-5 text-green-600" />
      ) : (
        <div className="flex items-center gap-2">
          <WifiOff className="h-5 w-5 text-red-600" />
          <span className="text-xs ml-2 text-red-600 hidden md:inline">
            Backend not connected
            {connectionError && <span className="block text-xs opacity-75">{connectionError}</span>}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 bg-red-200 hover:bg-red-300"
            onClick={checkConnection}
            disabled={isChecking}
          >
            <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
