import React from 'react';

export const LogoIcon = ({ className = "w-9 h-9" }: { className?: string }) => {
  return (
    <div className={`${className} relative flex items-center justify-center p-0.5`}>
      {/* Glow effect matching the image's outer aura */}
      <div className="absolute inset-0 bg-[#86F0FF]/15 blur-xl rounded-full" />
      
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(77,43,144,0.4)]"
      >
        <defs>
          {/* Main Background Gradient */}
          <linearGradient id="mainPurple" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#8E5CF7" />
             <stop offset="100%" stopColor="#4D2B90" />
          </linearGradient>
          
          {/* Subtle Inner Glow */}
          <linearGradient id="innerGlow" x1="50" y1="5" x2="50" y2="95">
             <stop offset="0%" stopColor="white" stopOpacity="0.2" />
             <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* EKG Gradient */}
          <linearGradient id="ekgColor" x1="0" y1="50" x2="100" y2="50">
             <stop offset="0%" stopColor="#86F0FF" />
             <stop offset="50%" stopColor="white" />
             <stop offset="100%" stopColor="#86F0FF" />
          </linearGradient>

          <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* The Outer Rounded Plus Shape (The glowing border) */}
        <path
          d="M38 5 H62 C65 5 67 7 67 10 V33 H90 C93 33 95 35 95 38 V62 C95 65 93 67 90 67 H67 V90 C67 93 65 95 62 95 H38 C35 95 33 93 33 90 V67 H10 C7 67 5 65 5 62 V38 C5 35 7 33 10 33 H33 V10 C33 7 35 5 38 5Z"
          fill="#311B92"
          stroke="#86F0FF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* The Main Purple Fill Shape */}
        <path
          d="M39 6 H61 C63 6 65 8 65 10 V34 H90 C92 34 94 36 94 38 V62 C94 64 92 66 90 66 H65 V90 C65 92 63 94 61 94 H39 C37 94 35 92 35 90 V66 H10 C8 66 6 64 6 62 V38 C6 36 8 34 10 34 H35 V10 C35 8 37 6 39 6Z"
          fill="url(#mainPurple)"
        />

        {/* Glossy Overlay (The light reflection in Image) */}
        <path
          d="M35 10 C35 8 37 6 39 6 H61 C63 6 65 8 65 10 V34 H90 C92 34 94 36 94 38 V45 L35 45 Z"
          fill="white"
          fillOpacity="0.12"
          className="pointer-events-none"
        />

        {/* Inner Highlight Line */}
        <path
          d="M39 7 H61 C62 7 64 9 64 10 V35 H90 C91 35 93 37 93 38 V62 C93 63 91 65 90 65 H64 V90 C64 91 62 93 61 93 H39 C38 93 36 91 36 90 V65 H10 C9 65 7 63 7 62 V38 C7 37 9 35 10 35 H36 V10 C36 9 38 7 39 7Z"
          stroke="white"
          strokeOpacity="0.15"
          strokeWidth="1"
        />

        {/* EKG / Pulse Line — Animated */}
        <path
          d="M2 50 H28 L35 30 L45 75 L55 10 L65 70 L72 50 H98"
          stroke="url(#ekgColor)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neon)"
          className="animate-ekg"
          style={{ 
            strokeDasharray: '200',
            strokeDashoffset: '200',
          }}
        />
      </svg>

      <style>{`
        @keyframes ekgFlow {
          0% { stroke-dashoffset: 400; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        .animate-ekg {
          animation: ekgFlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

