import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  delay = 400
}) => {
  const [active, setActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTip = () => {
    const id = setTimeout(() => {
      setActive(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActive(false);
  };

  // Position classes
  const getPositionClass = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2';
    }
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
    >
      {children}
      {active && (
        <div className={`absolute z-50 w-auto max-w-xs px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-100 ${getPositionClass()}`}>
          {content}
          {/* Arrow */}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full -translate-x-1/2 left-1/2 -translate-y-1/2' : 
              position === 'right' ? 'right-full translate-y-1/2 top-1/2 translate-x-1/2' :
              position === 'bottom' ? 'bottom-full -translate-x-1/2 left-1/2 translate-y-1/2' :
              'left-full translate-y-1/2 top-1/2 -translate-x-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
