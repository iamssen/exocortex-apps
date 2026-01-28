import type { ReactNode } from 'react';
import { getFlag } from './getFlag';

export interface FlagProps extends React.HTMLAttributes<HTMLSpanElement> {
  countryCode: string;
}

export function Flag({ countryCode, ...props }: FlagProps): ReactNode {
  return <span {...props}>{getFlag(countryCode)}</span>;
}
