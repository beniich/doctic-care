import React from 'react';

export const LogoIcon = ({ className = "w-9 h-9" }: { className?: string }) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl animate-pulse" />
      
      {/* Main Container - The Medical Cross Base */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9b7fff" />
            <stop offset="100%" stopColor="#1a0a3c" />
          </linearGradient>
          <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00c8ff" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#00c8ff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* The Cross Shape */}
        <path
          d="M35 15 C35 10, 40 5, 50 5 C60 5, 65 10, 65 15 V35 H85 C90 35, 95 40, 95 50 C95 60, 90 65, 85 65 H65 V85 C65 90, 60 95, 50 95 C40 95, 35 90, 35 85 V65 H15 C10 65, 5 60, 5 50 C5 40, 10 35, 15 35 H35 V15Z"
          fill="url(#crossGradient)"
          stroke="#9b7fff"
          strokeWidth="3"
        />
        
        {/* Shadow/Overlay for depth */}
        <path
          d="M35 15 C35 10, 40 5, 50 5 C60 5, 65 10, 65 15 V35 H85 C90 35, 95 40, 95 50 C95 60, 90 65, 85 65 H65 V85 C65 90, 60 95, 50 95 C40 95, 35 90, 35 85 V65 H15 C10 65, 5 60, 5 50 C5 40, 10 35, 15 35 H35 V15Z"
          fill="black"
          fillOpacity="0.2"
        />

        {/* EKG / Heartbeat Line */}
        <path
          d="M5 50 H30 L35 40 L42 65 L50 25 L58 75 L65 40 L70 50 H95"
          stroke="url(#ekgGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="animate-[dash_3s_linear_infinite]"
        />
      </svg>
      
      <style>{`
        @keyframes dash {
          0% { stroke-dasharray: 0, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 100, 200; stroke-dashoffset: 0; }
          100% { stroke-dasharray: 0, 200; stroke-dashoffset: -150; }
        }
      `}</style>
    </div>
  );
};
