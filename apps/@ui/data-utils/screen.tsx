import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ScreenContext } from './screen.context.ts';

export interface ScreenProviderProps {
  children: ReactNode;
}

export function ScreenProvider({ children }: ScreenProviderProps): ReactNode {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  const screen = useMemo(
    () => (isMobile ? 'portrait' : isTablet ? 'landscape' : 'desktop'),
    [isMobile, isTablet],
  );

  return (
    <ScreenContext.Provider value={{ screen }}>
      {children}
    </ScreenContext.Provider>
  );
}
