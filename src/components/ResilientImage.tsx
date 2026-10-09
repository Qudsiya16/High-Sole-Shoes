import React, { useState } from 'react';
import { Footprints } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackLabel,
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-zinc-200 text-zinc-600 p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <Footprints className="w-10 h-10 stroke-[1.5] text-zinc-500 mb-2" />
        <span className="font-display text-xs font-semibold tracking-wider uppercase text-zinc-700">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
