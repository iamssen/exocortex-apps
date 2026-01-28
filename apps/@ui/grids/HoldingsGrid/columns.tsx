import type { JoinedHolding, PortfolioMarket } from '@iamssen/exocortex';
import type { CurrencyType } from '@libs/format';
import { numberColumn } from '@libs/react-data-grid';
import type { Column } from 'react-data-grid';
import { marketPriceColumn } from '../columns/marketPriceColumn.tsx';
import { marketValueColumn } from '../columns/marketValueColumn.tsx';
import { quote52WeekColumn } from '../columns/quote52WeekColumn.tsx';
import { quotePeColumn } from '../columns/quotePeColumn.tsx';
import { quoteSymbolColumn } from '../columns/quoteSymbolColumn.tsx';
import cellStyles from './cellStyles.module.css';

interface ColumnOptions {
  market: PortfolioMarket;
  // currency 때문에 어차피 columns 재생성이 필요함
  currency: CurrencyType;
  printDisplayName?: boolean;
}

export interface Columns {
  symbol: Column<JoinedHolding>;
  avgCostPerShare: Column<JoinedHolding>;
  price: Column<JoinedHolding>;
  change: Column<JoinedHolding>;
  daysGain: Column<JoinedHolding>;
  sharesGain: Column<JoinedHolding>;
  realizedGain: Column<JoinedHolding>;
  totalGain: Column<JoinedHolding>;
  marketValue: Column<JoinedHolding>;
  shares: Column<JoinedHolding>;
  per: Column<JoinedHolding>;
  pbr: Column<JoinedHolding>;
  fiftyTwoWeek: Column<JoinedHolding>;
  buy: Column<JoinedHolding>;
  sell: Column<JoinedHolding>;
  roa: Column<JoinedHolding>;
  roe: Column<JoinedHolding>;
  beta: Column<JoinedHolding>;
}

export function createColumns({
  market,
  currency,
  printDisplayName = false,
}: ColumnOptions): Columns {
  const symbol = quoteSymbolColumn<JoinedHolding>({
    key: 'symbol',
    name: 'Symbol',
    frozen: true,
    width: '20%',
    minWidth: market === 'kr' ? 130 : 90,
    maxWidth: market === 'kr' ? 190 : 120,
    printDisplayName,
    selectSymbol: ({ holding, quote }) => quote?.symbol ?? holding.symbol,
    selectDisplayName: ({ quote }) => quote?.displayName,
    cellClass: market === 'kr' ? cellStyles.symbolKR : undefined,
  });

  const avgCostPerShare = numberColumn<JoinedHolding>({
    key: 'avgCost',
    name: 'Avg Cost',
    minWidth: 80,
    format: currency,
    select: ({ holding }) => holding.avgCostPerShare,
  });

  const price = marketPriceColumn<JoinedHolding>({
    key: 'price',
    name: 'Price',
    minWidth: 90,
    format: currency,
    selectMarketState: ({ quote }) => quote?.marketState,
    selectPrice: ({ quote }) => quote?.price,
  });

  const change = numberColumn<JoinedHolding>({
    key: 'change',
    name: 'Change',
    minWidth: 120,
    format: currency,
    select: ({ quote }) =>
      quote && quote.change !== 0 ? quote.change : undefined,
    referenceFormat: 'PERCENT',
    selectReference: ({ quote }) =>
      quote && quote.change !== 0 ? quote.changePercent : undefined,
  });

  const daysGain = numberColumn<JoinedHolding>({
    key: 'daysGain',
    name: `Day's Gain`,
    minWidth: 80,
    format: currency,
    select: ({ gain, holding }) =>
      holding.shares > 0 ? gain?.daysGain : undefined,
  });

  const sharesGain = numberColumn<JoinedHolding>({
    key: 'sharesGain',
    name: 'Shares Gain',
    minWidth: 140,
    format: currency,
    select: ({ gain, holding }) =>
      holding.shares > 0 ? gain?.sharesGain : undefined,
    referenceFormat: 'PERCENT',
    selectReference: ({ quote, holding }) =>
      quote && holding.shares > 0
        ? ((quote.price - holding.avgCostPerShare) / holding.avgCostPerShare) *
          100
        : undefined,
  });

  const realizedGain = numberColumn<JoinedHolding>({
    key: 'realizedGain',
    name: 'Realized Gain',
    minWidth: 90,
    format: currency,
    select: ({ holding }) => holding.realizedGain,
  });

  const totalGain = numberColumn<JoinedHolding>({
    key: 'totalGain',
    name: 'Total Gain',
    minWidth: 140,
    format: currency,
    select: ({ gain, holding }) =>
      holding.shares > 0 ? gain?.totalGain : undefined,
    referenceFormat: 'PERCENT',
    selectReference: ({ gain, holding }) =>
      gain && holding.shares > 0 ? gain.totalGainPercent : undefined,
  });

  const marketValue = marketValueColumn<JoinedHolding>({
    key: 'marketValue',
    name: 'Market Value',
    minWidth: 150,
    format: currency,
    selectMarketValue: ({ gain, holding }) =>
      holding.shares > 0 ? gain.marketValue : undefined,
  });

  const shares = numberColumn<JoinedHolding>({
    key: 'shares',
    name: 'Shares',
    minWidth: 70,
    select: ({ holding }) => holding.shares,
  });

  const per = quotePeColumn<JoinedHolding>({
    key: 'per',
    name: 'P/E',
    minWidth: 100,
    selectTrailingPe: ({ statistic }) =>
      statistic?.type === 'EQUITY' ? statistic?.trailingPE : undefined,
    selectForwardPe: ({ statistic }) =>
      statistic?.type === 'EQUITY' ? statistic?.forwardPE : undefined,
  });

  const pbr = numberColumn<JoinedHolding>({
    key: 'pbr',
    name: 'P/B',
    minWidth: 60,
    select: ({ statistic }) =>
      statistic?.type === 'EQUITY' ? statistic?.priceToBook : undefined,
  });

  const fiftyTwoWeek = quote52WeekColumn<JoinedHolding>({
    key: 'fiftyTwoWeek',
    name: '52 Week',
    minWidth: 130,
    format: currency,
    select: ({ statistic }) => statistic,
    cellClass: cellStyles.fiftyTwoWeeks,
  });

  const buy = numberColumn<JoinedHolding>({
    key: 'buy',
    name: 'Last Buy',
    minWidth: 80,
    format: currency,
    select: ({ holding }) => holding.prices.lastBuy,
  });

  const sell = numberColumn<JoinedHolding>({
    key: 'sell',
    name: 'Last Sell',
    minWidth: 80,
    format: currency,
    select: ({ holding }) => holding.prices.lastSell,
  });

  const roa = numberColumn<JoinedHolding>({
    key: 'roa',
    name: 'ROA',
    minWidth: 80,
    format: 'PERCENT',
    select: ({ statistic }) =>
      statistic?.type === 'EQUITY' &&
      typeof statistic?.returnOnAssets === 'number'
        ? statistic.returnOnAssets * 100
        : undefined,
  });

  const roe = numberColumn<JoinedHolding>({
    key: 'roe',
    name: 'ROE',
    minWidth: 80,
    format: 'PERCENT',
    select: ({ statistic }) =>
      statistic?.type === 'EQUITY' &&
      typeof statistic?.returnOnEquity === 'number'
        ? statistic.returnOnEquity * 100
        : undefined,
  });

  const beta = numberColumn<JoinedHolding>({
    key: 'beta',
    name: 'BETA',
    minWidth: 60,
    select: ({ statistic }) => statistic?.beta,
  });

  return {
    sharesGain,
    totalGain,
    daysGain,
    shares,
    avgCostPerShare,
    realizedGain,
    change,
    marketValue,
    price,
    symbol,
    per,
    pbr,
    fiftyTwoWeek,
    buy,
    sell,
    roa,
    roe,
    beta,
  };
}
