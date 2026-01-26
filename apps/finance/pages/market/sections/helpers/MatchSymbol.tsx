import type { ReactNode } from 'react';

export interface MatchHighLow {
  high?: boolean;
  low?: boolean;
}

export function MatchSymbol({ high, low }: MatchHighLow): ReactNode {
  return high ? <span> 🔥</span> : low ? <span> ❄️</span> : undefined;
}
