import React from 'react';
import { CheckBadgeIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Tooltip from './Tooltip';

export type VerificationStatus = 'verified' | 'unverified' | 'in-progress';

interface VerificationBadgeProps {
  status: VerificationStatus;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  showText = false,
  size = 'md',
  className = ''
}) => {
  let icon;
  let bgColor;
  let textColor;
  let label;
  let tooltipText;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  switch (status) {
    case 'verified':
      icon = <CheckBadgeIcon className={`${sizeClasses[size]} text-blue-600`} />;
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'Verified';
      tooltipText = 'This organization has been verified by WanGov';
      break;
    case 'in-progress':
      icon = <ClockIcon className={`${sizeClasses[size]} text-purple-600`} />;
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      label = 'In Progress';
      tooltipText = 'Verification is in progress';
      break;
    case 'unverified':
      icon = <ExclamationTriangleIcon className={`${sizeClasses[size]} text-orange-600`} />;
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      label = 'Unverified';
      tooltipText = 'This organization has not been verified';
      break;
  }

  const baseClasses = "inline-flex items-center rounded-full";
  const paddingClasses = showText ? "px-2.5 py-0.5" : "p-1";
  
  return (
    <Tooltip content={tooltipText}>
      <span 
        className={`${baseClasses} ${paddingClasses} ${bgColor} ${className}`}
      >
        {icon}
        {showText && (
          <span className={`ml-1 text-xs font-medium ${textColor}`}>
            {label}
          </span>
        )}
      </span>
    </Tooltip>
  );
};

export default VerificationBadge;
