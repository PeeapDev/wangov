import React, { useState } from 'react';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline';

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onImageChange?: (file: File) => void;
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  alt = 'Profile picture',
  size = 'md',
  editable = false,
  onImageChange,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      onImageChange(file);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const showPlaceholder = !src || imageError;

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showPlaceholder ? (
        <UserCircleIcon 
          className={`${iconSizeClasses[size]} text-gray-400`}
          aria-label={alt}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
          onError={handleImageError}
        />
      )}
      
      {editable && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`profile-picture-${size}`}
          />
          <label
            htmlFor={`profile-picture-${size}`}
            className={`
              absolute inset-0 flex items-center justify-center
              bg-black bg-opacity-50 rounded-full cursor-pointer
              transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <CameraIcon className="w-4 h-4 text-white" />
          </label>
        </>
      )}
    </div>
  );
};

export default ProfilePicture;
