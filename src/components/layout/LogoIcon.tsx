import React from 'react';

export const LogoIcon = ({ className = "w-9 h-9" }: { className?: string }) => {
  return (
    <div className={`${className} relative flex items-center justify-center p-1.5 glass-neon-icon`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50" />
      
      {/* Main Container - The Medical Cross Base */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full neon-pulse"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsla(var(--primary), 0.8)" />
            <stop offset="100%" stopColor="hsla(var(--accent), 0.9)" />
          </linearGradient>
          <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86F0FF" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#86F0FF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* The Cross Shape - More rounded and glassy like image */}
        <path
          d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 V5Z"
          fill="url(#crossGradient)"
          fillOpacity="0.4"
          stroke="hsla(var(--primary), 0.8)"
          strokeWidth="3"
          className="backdrop-blur-md"
        />
        
        {/* Subtle inner reflection */}
        <path
          d="M38 8 H62 V38 H92 V62 H62 V92 H38 V62 H8 V38 H38 V8Z"
          stroke="white"
          strokeOpacity="0.15"
          strokeWidth="1"
        />

        {/* EKG / Heartbeat Line */}
        <path
          d="M2 50 H28 L35 30 L45 75 L55 10 L65 70 L72 50 H98"
          stroke="url(#ekgGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};
