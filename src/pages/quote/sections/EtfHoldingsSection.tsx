import type { QuoteEtfHolding } from '@iamssen/exocortex';
import { Format } from '@iamssen/exocortex-appkit/format';
import { joinQuoteStatisticsAndQuote } from '@iamssen/exocortex/projector';
import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import styles from '../QuotePage.module.css';

export interface EtfHoldingsSectionProps {
  symbol: string;
}

export function EtfHoldingsSection({
  symbol,
}: EtfHoldingsSectionProps): ReactNode {
  const { data } = useQuery(api(`finance/quote-etf-holdings/${symbol}`));

  if (!data?.holdings) {
    return null;
  }

  return (
    <ul className={styles.etfHoldings}>
      {data.holdings.map((etfHolding) => (
        <Item key={etfHolding.name} {...etfHolding} />
      ))}
      <li>
        ETC{' '}
        <sub>
          (
          <Format
            format="PERCENT"
            n={data.holdings.reduce((t, { weight }) => t + weight, 0) * 100}
          />
          )
        </sub>
      </li>
    </ul>
  );
}

function Item({ name, weight, info }: QuoteEtfHolding) {
  return (
    <li>
      {info ? (
        <Link to={`/quote/${info.symbol}`}>
          {name}{' '}
          <sub>
            (<Format format="PERCENT" n={weight * 100} />)
          </sub>
          <Detail name={name} info={info} weight={weight} />
        </Link>
      ) : (
        <span>
          {name}{' '}
          <sub>
            (<Format format="PERCENT" n={weight * 100} />)
          </sub>
        </span>
      )}
    </li>
  );
}

function Detail({ info }: QuoteEtfHolding) {
  const { data: quoteData } = useQuery(api(`finance/quote/${info?.symbol}`));
  const { data: statisticData } = useQuery(
    api(`finance/quote-statistics/${info?.symbol}`),
  );

  const statistic = useMemo(
    () =>
      statisticData && quoteData
        ? joinQuoteStatisticsAndQuote(statisticData, quoteData)
        : undefined,
    [quoteData, statisticData],
  );

  return typeof statistic?.trailingPE === 'number' ? (
    <span>
      {' - '}
      <Format n={statistic.trailingPE} />
    </span>
  ) : null;
}
