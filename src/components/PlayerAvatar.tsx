import React, { useState } from 'react';
import { User } from 'lucide-react';

interface PlayerAvatarProps {
  photo: string;
  name: string;
  className?: string;
  fallbackSize?: number;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  photo,
  name,
  className = 'w-10 h-10',
  fallbackSize = 20,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !photo) {
    return (
      <div
        className={`flex items-center justify-center bg-[#15193B] border-2 border-black text-[#B8FF01] ${className}`}
        title={name}
      >
        <User size={fallbackSize} />
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={name}
      onError={() => setHasError(true)}
      loading="lazy"
      className={`object-cover bg-[#08091A] border-2 border-black ${className}`}
    />
  );
};
