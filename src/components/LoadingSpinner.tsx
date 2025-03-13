
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader 
        className="animate-spin text-vizNinja-purple" 
        size={size} 
      />
    </div>
  );
};

export default LoadingSpinner;
