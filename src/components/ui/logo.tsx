'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  imageClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showVersion?: boolean;
  versionText?: string;
  href?: string;
  alt?: string;
}

const sizeMap = {
  xs: { img: 'w-6 h-auto', text: 'text-base', box: 'w-6 h-7' },
  sm: { img: 'w-7 h-auto', text: 'text-lg', box: 'w-7 h-8' },
  md: { img: 'w-8 h-auto', text: 'text-xl', box: 'w-8 h-9' },
  lg: { img: 'w-10 h-auto', text: 'text-2xl', box: 'w-10 h-12' },
  xl: { img: 'w-14 h-auto', text: 'text-3xl', box: 'w-14 h-16' },
};

export default function Logo({
  className,
  imageClassName,
  size = 'md',
  showText = false,
  showVersion = false,
  versionText = 'v2.4',
  href,
  alt = 'Bhujal AI Logo',
}: LogoProps) {
  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div className={cn('relative shrink-0 flex items-center justify-center overflow-hidden rounded-md bg-[#01261E]', currentSize.box)}>
        {/* Official Bhujal AI Logo Asset - Single Source of Truth */}
        <img
          src="/logo.png"
          alt={alt}
          width={242}
          height={310}
          className={cn('w-full h-full object-contain', currentSize.img, imageClassName)}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-serif tracking-tight font-bold text-white flex items-center gap-1.5', currentSize.text)}>
            Bhujal AI
            {showVersion && (
              <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-normal">
                {versionText}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}
