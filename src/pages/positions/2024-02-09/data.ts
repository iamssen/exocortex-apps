import type { JoinedTrade } from '@iamssen/exocortex';
import { joinTradesAndQuotes } from '@iamssen/exocortex/projector';
import { useQuery } from '@tanstack/react-query';
import { useQuotes } from '@ui/data-utils';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { JoinedTrade2, PositionTrades } from './types.ts';

export const targets = [-0.2, -0.15, -0.1, -0.06, 0.1, 0.15, 0.2] as const;

const INITIAL_SELL = '2024-02-09';
const REBUY_AFTER_DROP = '2025-04-07';

export function usePosition(): PositionTrades | undefined {
  const { data: portfolio } = useQuery(api(`portfolio`));

  const targetTrades = useMemo(() => {
    if (!portfolio) {
      return undefined;
    }

    const sliceFrom = portfolio.holdings.us.trades.findLastIndex(
      ({ date }) => date < INITIAL_SELL,
    );

    return portfolio.holdings.us.trades.slice(sliceFrom);
  }, [portfolio]);

  const symbols = useMemo(() => {
    return targetTrades
      ? [...new Set(targetTrades.map(({ symbol }) => symbol))]
      : [];
  }, [targetTrades]);

  const quotes = useQuotes(symbols);

  const trades = useMemo<JoinedTrade[] | undefined>(() => {
    return targetTrades ? joinTradesAndQuotes(targetTrades, quotes) : undefined;
  }, [quotes, targetTrades]);

  return useMemo(() => {
    if (!trades) {
      return undefined;
    }

    const trades2 = trades
      .filter(({ quote }) => !!quote)
      .map(({ quote, trade }) => {
        return {
          quote,
          trade,
          diffRatio: quote!.price / trade.price - 1,
        };
      }) as JoinedTrade2[];

    const initialSellTrades: JoinedTrade2[] = [];
    const intermediateTrades: JoinedTrade2[] = [];
    const rebuyAfterDropTrades: JoinedTrade2[] = [];

    for (const t of trades2) {
      if (t.trade.date === INITIAL_SELL) {
        initialSellTrades.push(t);
      } else if (t.trade.date === REBUY_AFTER_DROP) {
        rebuyAfterDropTrades.push(t);
      } else if (
        t.trade.date > INITIAL_SELL &&
        t.trade.date < REBUY_AFTER_DROP
      ) {
        intermediateTrades.push(t);
      }
    }

    return {
      initialSellTrades,
      rebuyAfterDropTrades,
      intermediateTrades,
    };
  }, [trades]);
}

interface UseTotalAmountResult {
  tradeAmount: number;
  currentAmount: number;
  gain: number;
  gainRatio: number;
}

export function useTotalAmount(
  trades: JoinedTrade2[] = [],
): UseTotalAmountResult {
  return useMemo(() => {
    let tradeAmount: number = 0;
    let currentAmount: number = 0;

    let i: number = trades.length;
    while (--i >= 0) {
      const { trade, quote } = trades[i];
      tradeAmount += trade.price * trade.quantity;
      currentAmount += quote.price * trade.quantity;
    }

    const gain = currentAmount - tradeAmount;
    const gainRatio = gain / Math.abs(tradeAmount);

    return {
      tradeAmount,
      currentAmount,
      gain,
      gainRatio,
    };
  }, [trades]);
}

interface UseAggregateResult extends UseTotalAmountResult {
  tradeAmount: number;
  gainRatio: number;
  children: { diffRatio: number; label: string }[];
  currentAmount: number;
  benchmark: {
    voo:
      | (Required<Omit<JoinedTrade, 'isFirstAppearedDate'>> & {
          tradeAmount: number;
          diffRatio: number;
        })
      | undefined;
  };
  gain: number;
  target: {
    min: number;
    ticks: { amount: number; diff: number; target: number }[];
    max: number;
  };
}

export function useAggregate(trades: JoinedTrade2[] = []): UseAggregateResult {
  return useMemo(() => {
    let tradeAmount: number = 0;
    let currentAmount: number = 0;

    let i: number = trades.length;
    while (--i >= 0) {
      const { trade, quote } = trades[i];
      tradeAmount += trade.price * trade.quantity * -1;
      currentAmount += quote.price * trade.quantity * -1;
    }

    const ticks = targets.map((t) => {
      const amount = tradeAmount * (1 + t);
      const diff = amount - tradeAmount;
      return {
        target: t,
        amount,
        diff,
      };
    });

    const min = ticks[0].amount;
    const max = ticks.at(-1)?.amount ?? min;

    const gain = tradeAmount - currentAmount;
    const gainRatio = gain / tradeAmount;

    return {
      tradeAmount,
      currentAmount,
      gain,
      gainRatio,
      target: {
        ticks,
        min,
        max,
      },
      children: trades.map(({ trade, diffRatio }) => ({
        label: trade.symbol,
        diffRatio,
      })),
      benchmark: {
        voo: trades.find(({ quote }) => quote.symbol === 'VOO'),
      },
    };
  }, [trades]);
}
