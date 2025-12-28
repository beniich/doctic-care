import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SpaceType = 'personal' | 'team' | 'organization';
export type PeriodType = '7d' | '30d' | '90d';

interface LivePulseContextType {
  currentSpace: SpaceType;
  currentPeriod: PeriodType;
  setCurrentSpace: (space: SpaceType) => void;
  setCurrentPeriod: (period: PeriodType) => void;
}

const LivePulseContext = createContext<LivePulseContextType | undefined>(undefined);

export function LivePulseProvider({ children }: { children: ReactNode }) {
  const [currentSpace, setCurrentSpace] = useState<SpaceType>('personal');
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>('30d');

  return (
    <LivePulseContext.Provider value={{
      currentSpace,
      currentPeriod,
      setCurrentSpace,
      setCurrentPeriod
    }}>
      {children}
    </LivePulseContext.Provider>
  );
}

export function useLivePulse() {
  const context = useContext(LivePulseContext);
  if (context === undefined) {
    throw new Error('useLivePulse must be used within a LivePulseProvider');
  }
  return context;
}
