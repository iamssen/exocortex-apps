import type { Context } from 'react';
import { createContext, useContext } from 'react';

export interface Screen {
  screen: 'portrait' | 'landscape' | 'desktop';
}

export const ScreenContext: Context<Screen> = createContext<Screen>(null!);

export function useScreen(): Screen {
  return useContext(ScreenContext);
}
