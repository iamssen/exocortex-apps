import type { MarketState } from '@iamssen/exocortex';
import type { DataHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { MdOutlineWbSunny, MdOutlineWbTwilight } from 'react-icons/md';
import component from './MarketStateSymbol.module.css';

export interface MarketStateSymbolProps extends Omit<
  DetailedHTMLProps<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>,
  'value'
> {
  marketState: MarketState | undefined;
}

export function MarketStateSymbol({
  marketState,
  ...dataProps
}: MarketStateSymbolProps): ReactNode {
  return (
    <data {...dataProps} value={marketState} className={component.style}>
      {marketState === 'PRE' ? (
        <MdOutlineWbTwilight />
      ) : marketState === 'REGULAR' ? (
        <MdOutlineWbSunny />
      ) : null}
    </data>
  );
}
