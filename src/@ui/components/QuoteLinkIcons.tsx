import type { QuoteInfo } from '@iamssen/exocortex';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { OutLink } from './OutLink.tsx';

export interface QuoteLinkIconsProps {
  info: QuoteInfo;
}

export function QuoteLinkIcons({
  info: { links, symbols, type },
}: QuoteLinkIconsProps): ReactNode {
  const alphaSpreadLink = useMemo(() => {
    if (type !== 'EQUITY' || !symbols.google) {
      return undefined;
    }

    const [t, m] = symbols.google.split(':');
    const ticker = t.toLowerCase();
    let market = m.toLowerCase();

    if (market === 'tyo') {
      market = 'tse';
    }

    return `https://www.alphaspread.com/security/${market}/${ticker}/summary`;
  }, [symbols.google, type]);

  return (
    <>
      <OutLink href={links.yahoo}>
        <img src="/icons/yahoo.svg" alt="Yahoo Finance!" />
      </OutLink>

      {links.naver && (
        <OutLink href={links.naver}>
          <img src="/icons/naver.svg" alt="Naver Stocks" />
        </OutLink>
      )}

      {links.google && (
        <OutLink href={links.google}>
          <img src="/icons/google.svg" alt="Google Finance" />
        </OutLink>
      )}

      {links.binance && (
        <OutLink href={links.binance}>
          <img src="/icons/binance.svg" alt="Binance" />
        </OutLink>
      )}

      {alphaSpreadLink && (
        <OutLink href={alphaSpreadLink}>
          <img src="/icons/alphaspread.svg" alt="Alpha Spread" />
        </OutLink>
      )}
    </>
  );
}
