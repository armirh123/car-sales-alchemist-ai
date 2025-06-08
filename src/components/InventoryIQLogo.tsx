
import React from 'react';
import { Brain, Package } from 'lucide-react';

interface InventoryIQLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const InventoryIQLogo: React.FC<InventoryIQLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {/* Main logo container with gradient background */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-1.5 shadow-lg flex items-center justify-center relative overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
          
          {/* Main icons */}
          <div className="relative flex items-center justify-center">
            <Package className="h-3/5 w-3/5 text-white relative z-10" />
            <Brain className="h-2/5 w-2/5 text-white/90 absolute -top-0.5 -right-0.5" />
          </div>
        </div>
        
        {/* Small accent dot */}
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full shadow-sm"></div>
      </div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          InventoryIQ
        </span>
      )}
    </div>
  );
};

export default InventoryIQLogo;
