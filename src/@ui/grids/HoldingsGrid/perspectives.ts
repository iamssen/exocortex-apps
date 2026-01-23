import type { JoinedHolding } from '@iamssen/exocortex';
import { clsx } from 'clsx/lite';
import type { Column } from 'react-data-grid';
import rowStyles from '../rowStyles.module.css';
import type { Columns } from './columns.tsx';

export interface Perspective {
  columns: Column<JoinedHolding>[];
  sort: (a: JoinedHolding, b: JoinedHolding) => number;
  rowClass: (holding: JoinedHolding) => string | null;
}

export interface Perspectives {
  daysGain: Perspective;
  totalGain: Perspective;
  sharesGain: Perspective;
  realizedGain: Perspective;
  marketValue: Perspective;
  fiftyTwoWeek: Perspective;
  per: Perspective;
  pbr: Perspective;
  price: Perspective;
  beta: Perspective;
}

export function createPerspectives({
  symbol,
  avgCostPerShare,
  price,
  change,
  daysGain,
  sharesGain,
  realizedGain,
  totalGain,
  marketValue,
  shares,
  per,
  pbr,
  fiftyTwoWeek,
  buy,
  sell,
  roa,
  roe,
  beta,
}: Columns): Perspectives {
  return {
    daysGain: {
      columns: [
        symbol,
        avgCostPerShare,
        price,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        totalGain,
        marketValue,
        shares,
        per,
        pbr,
        fiftyTwoWeek,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return (a.quote?.changePercent ?? 0) - (b.quote?.changePercent ?? 0);
      },
      rowClass: ({ holding, quote }) => {
        console.log(
          clsx(
            holding.shares === 0 && rowStyles.gridRowUnimportant,
            (quote?.change ?? 0) < 0 && rowStyles.gridRowNegative,
          ),
        );
        return clsx(
          holding.shares === 0 && rowStyles.gridRowUnimportant,
          (quote?.change ?? 0) < 0 && rowStyles.gridRowNegative,
        );
      },
    },
    totalGain: {
      columns: [
        symbol,
        avgCostPerShare,
        price,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        marketValue,
        shares,
        per,
        pbr,
        fiftyTwoWeek,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return (a.gain?.totalGain ?? 0) - (b.gain?.totalGain ?? 0);
      },
      rowClass: ({ holding, gain }) => {
        return clsx(
          holding.shares === 0 && rowStyles.gridRowUnimportant,
          (gain?.totalGain ?? 0) < 0 && rowStyles.gridRowNegative,
        );
      },
    },
    sharesGain: {
      columns: [
        symbol,
        avgCostPerShare,
        price,
        sharesGain,
        realizedGain,
        totalGain,
        change,
        daysGain,
        marketValue,
        shares,
        per,
        pbr,
        fiftyTwoWeek,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return (
          (a.gain?.sharesGainPercent ?? 0) - (b.gain?.sharesGainPercent ?? 0)
        );
      },
      rowClass: ({ holding, gain }) => {
        return clsx(
          holding.shares === 0 && rowStyles.gridRowUnimportant,
          (gain?.sharesGainPercent ?? 0) < 0 && rowStyles.gridRowNegative,
        );
      },
    },
    realizedGain: {
      columns: [
        symbol,
        avgCostPerShare,
        price,
        realizedGain,
        sharesGain,
        totalGain,
        change,
        daysGain,
        marketValue,
        shares,
        per,
        pbr,
        fiftyTwoWeek,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return a.holding.realizedGain - b.holding.realizedGain;
      },
      rowClass: ({ holding }) => {
        return clsx(
          holding.shares === 0 && rowStyles.gridRowUnimportant,
          holding.realizedGain < 0 && rowStyles.gridRowNegative,
        );
      },
    },
    marketValue: {
      columns: [
        symbol,
        avgCostPerShare,
        price,
        marketValue,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        shares,
        per,
        pbr,
        fiftyTwoWeek,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return (b.gain?.marketValue ?? 0) - (a.gain?.marketValue ?? 0);
      },
      rowClass: ({ holding }) => {
        return clsx(holding.shares === 0 && rowStyles.gridRowUnimportant);
      },
    },
    fiftyTwoWeek: {
      columns: [
        symbol,
        price,
        fiftyTwoWeek,
        per,
        pbr,
        avgCostPerShare,
        marketValue,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        shares,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return typeof a.statistic?.fiftyTwoWeekPosition === 'number' &&
          typeof b.statistic?.fiftyTwoWeekPosition === 'number'
          ? a.statistic.fiftyTwoWeekPosition - b.statistic.fiftyTwoWeekPosition
          : a.statistic
            ? -1000
            : 1000;
      },
      rowClass: ({ holding, statistic }) => {
        const nonHoldings =
          holding.shares === 0 && rowStyles.gridRowUnimportant;

        if (!statistic?.fiftyTwoWeekRange || !statistic.price) {
          return clsx(nonHoldings);
        }

        const position = statistic.fiftyTwoWeekPosition ?? 0;

        return clsx(
          nonHoldings,
          position < 0.15 && rowStyles.gridRowPositive,
          position > 0.85 && rowStyles.gridRowNegative,
        );
      },
    },
    price: {
      columns: [
        symbol,
        price,
        buy,
        sell,
        fiftyTwoWeek,
        per,
        pbr,
        avgCostPerShare,
        marketValue,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        shares,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return typeof a.statistic?.fiftyTwoWeekPosition === 'number' &&
          typeof b.statistic?.fiftyTwoWeekPosition === 'number'
          ? a.statistic.fiftyTwoWeekPosition - b.statistic.fiftyTwoWeekPosition
          : a.statistic
            ? -1000
            : 1000;
      },
      rowClass: ({ holding, statistic }) => {
        const nonHoldings =
          holding.shares === 0 && rowStyles.gridRowUnimportant;

        if (!statistic?.fiftyTwoWeekRange || !statistic.price) {
          return clsx(nonHoldings);
        }
        const position = statistic.fiftyTwoWeekPosition ?? 0;

        return clsx(
          nonHoldings,
          position < 0.15 && rowStyles.gridRowPositive,
          position > 0.85 && rowStyles.gridRowNegative,
        );
      },
    },
    per: {
      columns: [
        symbol,
        per,
        price,
        fiftyTwoWeek,
        pbr,
        avgCostPerShare,
        marketValue,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        shares,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return a.statistic?.type === 'EQUITY' && b.statistic?.type === 'EQUITY'
          ? (b.statistic.trailingPE ?? 0) - (a.statistic.trailingPE ?? 0)
          : a.statistic?.type === 'EQUITY'
            ? -1000
            : 1000;
      },
      rowClass: ({ holding, statistic }) => {
        const nonHoldings =
          holding.shares === 0 && rowStyles.gridRowUnimportant;

        if (
          statistic?.type !== 'EQUITY' ||
          typeof statistic.trailingPE !== 'number'
        ) {
          return clsx(nonHoldings);
        }

        return clsx(
          nonHoldings,
          statistic.trailingPE > 25 && rowStyles.gridRowNegative,
          statistic.trailingPE < 10 && rowStyles.gridRowPositive,
        );
      },
    },
    pbr: {
      columns: [
        symbol,
        pbr,
        per,
        fiftyTwoWeek,
        avgCostPerShare,
        price,
        marketValue,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        shares,
        buy,
        sell,
        roa,
        roe,
        beta,
      ],
      sort: (a, b) => {
        return a.statistic?.type === 'EQUITY' && b.statistic?.type === 'EQUITY'
          ? (b.statistic.priceToBook ?? 0) - (a.statistic.priceToBook ?? 0)
          : a.statistic?.type === 'EQUITY'
            ? -1000
            : 1000;
      },
      rowClass: ({ holding, statistic }) => {
        const nonHoldings =
          holding.shares === 0 && rowStyles.gridRowUnimportant;

        if (
          statistic?.type !== 'EQUITY' ||
          typeof statistic.priceToBook !== 'number'
        ) {
          return clsx(nonHoldings);
        }

        return clsx(
          nonHoldings,
          statistic.priceToBook > 15 && rowStyles.gridRowNegative,
          statistic.priceToBook < 2 && rowStyles.gridRowPositive,
        );
      },
    },
    beta: {
      columns: [
        beta,
        symbol,
        price,
        fiftyTwoWeek,
        per,
        pbr,
        avgCostPerShare,
        marketValue,
        totalGain,
        change,
        daysGain,
        sharesGain,
        realizedGain,
        shares,
        buy,
        sell,
        roa,
        roe,
      ],
      sort: (a, b) => {
        return typeof a.statistic?.beta === 'number' &&
          typeof b.statistic?.beta === 'number'
          ? a.statistic.beta - b.statistic.beta
          : a.statistic
            ? -1000
            : 1000;
      },
      rowClass: ({ statistic }) => {
        if (!statistic?.beta || !statistic?.fiftyTwoWeekPosition) {
          return rowStyles.gridRowUnimportant;
        }

        const betaValue = statistic.beta ?? 1;
        const fiftyTwoWeekPosition = statistic.fiftyTwoWeekPosition ?? 0;

        if (betaValue > 1.1 && fiftyTwoWeekPosition < 0.5) {
          return rowStyles.gridRowPositive;
        } else if (betaValue < 0.9 && fiftyTwoWeekPosition > 0.5) {
          return rowStyles.gridRowUnimportant;
        } else if (betaValue > 1.1 && fiftyTwoWeekPosition > 0.5) {
          return rowStyles.gridRowNegative;
        } else if (betaValue > 0.9 && fiftyTwoWeekPosition < 0.5) {
          return rowStyles.gridRowUnimportant;
        }
        return rowStyles.gridRowUnimportant;
      },
    },
  };
}
