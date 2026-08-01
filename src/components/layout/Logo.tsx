'use client';

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  color?: 'original' | 'white';
  className?: string;
  height?: number;
}

export default function Logo({
  variant = 'compact',
  color = 'original',
  className = '',
  height = 40,
}: LogoProps) {
  // Mauve/rose-brown color from the official logo asset
  const fillClass = color === 'white' ? 'text-white' : 'text-[#b08968]';
  const strokeClass = color === 'white' ? 'stroke-white' : 'stroke-[#b08968]';
  const circleBg = color === 'white' ? 'fill-[#1a1815]' : 'fill-white';

  // Sizing calculations: aspect ratio for full lockup is roughly 4:1 (width: 400, height: 100)
  // For compact lockup it is roughly 3:1 (width: 300, height: 100)
  // For icon it is 1:1 (width: 100, height: 100)
  const width = variant === 'full' ? height * 4 : variant === 'compact' ? height * 3 : height;

  return (
    <svg
      width={width}
      height={height}
      viewBox={variant === 'full' ? '0 0 400 100' : variant === 'compact' ? '0 0 300 100' : '0 0 100 100'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none transition-all duration-300`}
    >
      {/* ── GLOBE & AIRPLANE ICON PART ── */}
      <g transform="translate(0, 0)">
        {/* Dotted orbits around the globe */}
        {/* Top-Right dotted arc */}
        <path
          d="M 58 10 A 42 42 0 0 1 90 42"
          className={`${strokeClass}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1.5 4"
        />
        {/* Bottom-Left dotted arc */}
        <path
          d="M 42 90 A 42 42 0 0 1 10 58"
          className={`${strokeClass}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1.5 4"
        />
        {/* Small orbit circles (as seen in the logo dots) */}
        <circle cx="92" cy="30" r="1.5" className={`${fillClass}`} />
        <circle cx="85" cy="18" r="1.5" className={`${fillClass}`} />
        <circle cx="74" cy="11" r="1.5" className={`${fillClass}`} />

        <circle cx="8" cy="70" r="1.5" className={`${fillClass}`} />
        <circle cx="15" cy="82" r="1.5" className={`${fillClass}`} />
        <circle cx="26" cy="89" r="1.5" className={`${fillClass}`} />

        {/* Main Globe Circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          className={`${strokeClass}`}
          strokeWidth="2.5"
        />

        {/* Meridians (Vertical Curves) */}
        {/* Left Meridian */}
        <path
          d="M 50 12 A 38 38 0 0 0 32 50 A 38 38 0 0 0 50 88"
          className={`${strokeClass}`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Right Meridian */}
        <path
          d="M 50 12 A 38 38 0 0 1 68 50 A 38 38 0 0 1 50 88"
          className={`${strokeClass}`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Center Vertical Line */}
        <path
          d="M 50 12 V 88"
          className={`${strokeClass}`}
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Parallels (Horizontal Curves) */}
        {/* Top Parallel */}
        <path
          d="M 16 35 Q 50 45 84 35"
          className={`${strokeClass}`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Bottom Parallel */}
        <path
          d="M 16 65 Q 50 55 84 65"
          className={`${strokeClass}`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Center Horizontal Line */}
        <path
          d="M 12 50 H 88"
          className={`${strokeClass}`}
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Center Background Mask (Circular cutout behind plane to keep it clean) */}
        <circle cx="50" cy="50" r="16" className={`${circleBg}`} />

        {/* Airplane Symbol (Rotated 45 deg, facing top-left) */}
        <g transform="translate(50, 50) rotate(-45)">
          <path
            d="M 0 -13 
               C 1 -13, 2.5 -9, 2.5 -5 
               L 2.5 1 
               L 11 5 
               C 11.5 5.3, 11.5 6, 11 6.3 
               L 2.5 5 
               L 2.5 9 
               L 5 11 
               C 5.3 11.2, 5.3 11.7, 5 11.9 
               L 0.5 11 
               L -0.5 11 
               L -5 11.9 
               C -5.3 11.7, -5.3 11.2, -5 11 
               L -2.5 9 
               L -2.5 5 
               L -11 6.3 
               C -11.5 6, -11.5 5.3, -11 5 
               L -2.5 1 
               L -2.5 -5 
               C -2.5 -9, -1 -13, 0 -13 Z"
            className={`${fillClass}`}
            fillRule="evenodd"
          />
        </g>
      </g>

      {/* ── WORDMARK ("TRAVEL & HALT") ── */}
      {variant !== 'icon' && (
        <g transform="translate(100, 0)">
          {/* Main Brand Title */}
          <text
            x="10"
            y="54"
            className={`${fillClass}`}
            fill="currentColor"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="34"
            fontWeight="800"
            letterSpacing="0.06em"
          >
            TRAVEL &amp; HALT
          </text>

          {/* Full Variant: Tagline "HUNGRY, ANGRY, LONELY, TIRED" */}
          {variant === 'full' && (
            <text
              x="12"
              y="78"
              className={`${fillClass}`}
              fill="currentColor"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="10"
              fontWeight="700"
              letterSpacing="0.19em"
              opacity="0.85"
            >
              HUNGRY, ANGRY, LONELY, TIRED
            </text>
          )}

          {/* Compact Variant: Subtitle "TOUR • TRAVEL" (for spacing consistency in header) */}
          {variant === 'compact' && (
            <text
              x="12"
              y="74"
              className={`${fillClass}`}
              fill="currentColor"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="9"
              fontWeight="800"
              letterSpacing="0.32em"
              opacity="0.75"
            >
              TOUR • TRAVEL
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
