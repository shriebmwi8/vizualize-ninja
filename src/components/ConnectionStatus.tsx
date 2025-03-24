
import React, { useState, useEffect } from 'react';
import { Wifi, RefreshCw } from 'lucide-react';
import { checkServerConnection } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';

const ConnectionStatus: React.FC = () => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  
  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await checkServerConnection();
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 p-3 rounded-full bg-green-100 shadow-md z-50 flex items-center justify-center transition-all duration-300">
      <Wifi className="h-5 w-5 text-green-600" />
      <span className="text-xs ml-2 text-green-600 hidden md:inline">
        Mock Backend (No server needed)
      </span>
    </div>
  );
};

export default ConnectionStatus;
