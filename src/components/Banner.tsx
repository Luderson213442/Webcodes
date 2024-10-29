import React from 'react';
import { Banner as BannerType } from '../types';

interface BannerProps {
  banner: BannerType;
}

export function Banner({ banner }: BannerProps) {
  const content = (
    <div className="relative w-full h-32 sm:h-48 overflow-hidden bg-gray-900">
      <img
        src={banner.imageUrl}
        alt="Banner"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );

  return banner.link ? (
    <a
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {content}
    </a>
  ) : (
    content
  );
}