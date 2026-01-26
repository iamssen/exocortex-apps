import type { JoinedTrade, PortfolioMarket } from '@iamssen/exocortex';
import type { CurrencyType } from '@ssen/format';
import { column, numberColumn } from '@ssen/react-data-grid';
import type { Column } from 'react-data-grid';
import { quoteSymbolColumn } from '../columns/quoteSymbolColumn.tsx';
import cellStyles from './cellStyles.module.css';

interface ColumnOptions {
  market: PortfolioMarket;
  currency: CurrencyType;
  printDisplayName?: boolean;
}

export interface Columns {
  date: Column<JoinedTrade>;
  symbol: Column<JoinedTrade>;
  price: Column<JoinedTrade>;
  quantity: Column<JoinedTrade>;
  totalAmount: Column<JoinedTrade>;
  currentPrice: Column<JoinedTrade>;
  gain: Column<JoinedTrade>;
  comment: Column<JoinedTrade>;
}

export function createColumns({
  market,
  currency,
  printDisplayName = false,
}: ColumnOptions): Columns {
  const date = column<JoinedTrade>({
    key: 'date',
    name: 'Date',
    frozen: true,
    minWidth: 100,
    select: ({ isFirstAppearedDate, trade }) => (
      <time
        dateTime={trade.date}
        style={{ opacity: !isFirstAppearedDate ? 0.2 : undefined }}
      >
        {trade.date}
      </time>
    ),
  });

  const symbol = quoteSymbolColumn<JoinedTrade>({
    key: 'symbol',
    name: 'Symbol',
    frozen: true,
    minWidth: market === 'kr' ? 130 : 90,
    maxWidth: market === 'kr' ? 190 : 120,
    printDisplayName,
    selectSymbol: ({ trade }) => trade.symbol,
    selectDisplayName: ({ quote }) => quote?.displayName,
    cellClass: market === 'kr' ? cellStyles.symbolKR : undefined,
  });

  const price = numberColumn<JoinedTrade>({
    key: 'price',
    name: 'Price',
    minWidth: 100,
    format: currency,
    select: ({ trade }) => trade.price,
  });

  const quantity = numberColumn<JoinedTrade>({
    key: 'quantity',
    name: 'Quantity',
    minWidth: 70,
    select: ({ trade }) => trade.quantity,
  });

  const totalAmount = numberColumn<JoinedTrade>({
    key: 'totalAmount',
    name: 'Total Amount',
    minWidth: 120,
    format: currency,
    select: ({ trade }) => trade.price * trade.quantity,
  });

  const currentPrice = numberColumn<JoinedTrade>({
    key: 'currentPrice',
    name: 'Current Price',
    minWidth: 140,
    format: currency,
    select: ({ quote }) => quote?.price,
    referenceFormat: 'PERCENT',
    selectReference: ({ trade, quote }) =>
      quote && trade.price > 0
        ? ((quote.price - trade.price) / trade.price) * 100
        : undefined,
  });

  const gain = numberColumn<JoinedTrade>({
    key: 'gain',
    name: 'Gain',
    minWidth: 120,
    format: currency,
    select: ({ trade, quote }) =>
      quote ? (quote.price - trade.price) * trade.quantity : undefined,
  });

  const comment = column<JoinedTrade>({
    key: 'comment',
    name: 'Comment',
    select: ({ trade }) => trade.comment,
  });

  return {
    date,
    symbol,
    price,
    quantity,
    totalAmount,
    currentPrice,
    gain,
    comment,
  };
}
