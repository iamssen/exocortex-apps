import type {
  AggregatedTrade,
  JoinedTrade,
  PortfolioMarket,
} from '@iamssen/exocortex';
import type { CurrencyType } from '@iamssen/exocortex-appkit/format';
import { FormatConfig } from '@iamssen/exocortex-appkit/format';
import {
  aggregateTrades,
  joinTradesAndQuotes,
} from '@iamssen/exocortex/projector';
import { useQuery } from '@tanstack/react-query';
import { TradeAmountChart } from '@ui/charts';
import { useQuotes } from '@ui/data-utils';
import { TradesGrid } from '@ui/grids';
import { api } from '@ui/query';
import { type ReactNode, useMemo } from 'react';
import { Page } from '../../Page.tsx';
import styles from './TradeHistoryPage.module.css';

export interface TradeHistoryPageProps {
  currency: CurrencyType;
  benchmarkSymbol: string;
  market: PortfolioMarket;
  printDisplayName?: boolean;
}

export function TradeHistoryPage({
  currency,
  market,
  benchmarkSymbol,
  printDisplayName,
}: TradeHistoryPageProps): ReactNode {
  const { data: portfolio } = useQuery(api(`portfolio`));

  const { data: benchmarkHistory } = useQuery(
    api(`finance/quote-history/${benchmarkSymbol}`),
  );

  const symbols = useMemo(
    () => portfolio?.holdings[market].symbols ?? [],
    [portfolio?.holdings, market],
  );

  const quotes = useQuotes(symbols);

  const trades = useMemo<JoinedTrade[] | undefined>(() => {
    return portfolio
      ? joinTradesAndQuotes(portfolio.holdings[market].trades, quotes)
      : undefined;
  }, [portfolio, market, quotes]);

  const aggregated = useMemo<AggregatedTrade[] | undefined>(() => {
    return trades ? aggregateTrades(trades) : undefined;
  }, [trades]);

  return (
    <Page layout="fixed" className={styles.style}>
      <FormatConfig krwShortUnits>
        {aggregated && (
          <TradeAmountChart
            role="figure"
            trades={aggregated}
            benchmarkHistory={benchmarkHistory}
            currency={currency}
          />
        )}
        {trades && (
          <TradesGrid
            role="grid"
            key={market}
            currency={currency}
            portfolio={market}
            printDisplayName={printDisplayName}
            rows={trades}
          />
        )}
      </FormatConfig>
    </Page>
  );
}
