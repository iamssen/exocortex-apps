import type {
  JoinedFX,
  JoinedHoldings,
  JPY,
  KRW,
  Portfolio,
  PortfolioSummary,
  Quote,
  USD,
} from '@iamssen/exocortex';
import {
  createSummary,
  getStableCoinMarketValue,
  joinFxAndQuote,
  joinHoldingsAndQuotes,
} from '@iamssen/exocortex/projector';
import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import { useMemo } from 'react';
import { createSimulation } from './createSimulation.ts';
import type { OtherCurrencyBalances } from './useOtherCurrenciesBalances.ts';
import { useOtherCurrenciesBalances } from './useOtherCurrenciesBalances.ts';
import { useQuotes } from './useQuotes.ts';

export interface SummaryValue {
  portfolio: Portfolio | undefined;
  usdkrw: Quote | undefined;
  jpykrw: Quote | undefined;
  quotes: Map<string, Quote>;

  fxUSD: JoinedFX<USD> | undefined;
  fxJPY: JoinedFX<JPY> | undefined;
  us: JoinedHoldings;
  kr: JoinedHoldings;
  jp: JoinedHoldings;
  crypto: JoinedHoldings;
  summary: ExtendedSummary | undefined;

  otherCurrencies: OtherCurrencyBalances[];
  otherCurrenciesTotalAmount: KRW;
}

export function useSummary(): SummaryValue {
  const { data: portfolio } = useQuery(api('portfolio'));

  const { data: usdkrw } = useQuery(api('finance/quote/KRW=X'));
  const { data: jpykrw } = useQuery(api('finance/quote/JPYKRW=X'));

  const otherCurrencies = useOtherCurrenciesBalances(
    portfolio?.balances.others,
  );

  const symbols = useMemo(
    () => (portfolio ? Object.keys(portfolio.holdings.index) : []),
    [portfolio],
  );

  const quotes = useQuotes(symbols);

  const us = useMemo(
    () => joinHoldingsAndQuotes(portfolio?.holdings.us.list ?? [], quotes),
    [portfolio?.holdings.us.list, quotes],
  );

  const kr = useMemo(
    () => joinHoldingsAndQuotes(portfolio?.holdings.kr.list ?? [], quotes),
    [portfolio?.holdings.kr.list, quotes],
  );

  const jp = useMemo(
    () => joinHoldingsAndQuotes(portfolio?.holdings.jp.list ?? [], quotes),
    [portfolio?.holdings.jp.list, quotes],
  );

  const crypto = useMemo(
    () => joinHoldingsAndQuotes(portfolio?.holdings.crypto.list ?? [], quotes),
    [portfolio?.holdings.crypto.list, quotes],
  );

  const otherCurrenciesTotalAmount = useMemo(
    () => otherCurrencies.reduce((t, { krwAmount }) => t + krwAmount, 0) as KRW,
    [otherCurrencies],
  );

  const fxUSD = useMemo(
    () =>
      portfolio
        ? joinFxAndQuote<USD>(
            portfolio.fx.usd,
            portfolio.balances.usd,
            undefined,
            portfolio.bonds.us,
            usdkrw,
          )
        : undefined,
    [portfolio, usdkrw],
  );

  const fxJPY = useMemo(
    () =>
      portfolio
        ? joinFxAndQuote<JPY>(
            portfolio.fx.jpy,
            portfolio.balances.jpy,
            undefined,
            undefined,
            jpykrw,
          )
        : undefined,
    [portfolio, jpykrw],
  );

  const summary = useMemo(() => {
    if (!usdkrw || !jpykrw || !portfolio) {
      return undefined;
    }

    return createExtendedSummary(
      portfolio,
      usdkrw,
      jpykrw,
      us,
      kr,
      jp,
      crypto,
      quotes,
      otherCurrenciesTotalAmount,
    );
  }, [
    crypto,
    portfolio,
    jp,
    jpykrw,
    kr,
    otherCurrenciesTotalAmount,
    quotes,
    us,
    usdkrw,
  ]);

  return {
    portfolio,
    usdkrw,
    jpykrw,
    quotes,
    fxUSD,
    fxJPY,
    us,
    kr,
    jp,
    crypto,
    summary,
    otherCurrencies,
    otherCurrenciesTotalAmount,
  };
}

export type ExtendedSummary = PortfolioSummary & {
  ingredients: {
    gold: number;
    krw: { riskless: any; cash: KRW; stocks: number };
    jpy: { cash: number; stocks: number };
    housing: KRW;
    purpose: {
      gold: number;
      krw: { riskless: number; cash: number; stocks: number };
      jpy: { cash: number; stocks: number };
      housing: number;
      usd: { riskless: number; cash: number; stocks: number };
      crypto: { coins: number; stable: number };
    };
    usd: { riskless: number; cash: number; stocks: number };
    crypto: { coins: number; stable: number };
  };
  simulates:
    | undefined
    | {
        jpy: number;
        totalGain: number;
        changeRisk: {
          riskAmount: number;
          totalGain: number;
          riskPercent: number;
          totalGainPercent: number;
          marketValue: number;
        }[];
        spyPrice: number;
        totalGainPercent: number;
        usd: number;
        name: string;
        marketValue: any;
        rise: number;
      }[];
};

function createExtendedSummary(
  portfolio: Portfolio,
  usdkrw: Quote,
  jpykrw: Quote,
  us: JoinedHoldings,
  kr: JoinedHoldings,
  jp: JoinedHoldings,
  crypto: JoinedHoldings,
  quotes: Map<string, Quote>,
  otherCurrenciesTotalAmount: KRW,
): ExtendedSummary {
  const summary = createSummary(
    portfolio,
    usdkrw,
    jpykrw,
    us,
    kr,
    jp,
    crypto,
    otherCurrenciesTotalAmount,
  );

  const usd = usdkrw.price as KRW;
  const jpy = jpykrw.price as KRW;

  const stableCoinMarketValue: USD = getStableCoinMarketValue(crypto.holdings);

  const ingredients = {
    usd: {
      cash: portfolio.balances.usd.totalAmount * usd,
      riskless: portfolio.bonds.us.totalPurchasePrice * usd,
      stocks: us.gain.marketValue * usd,
    },
    krw: {
      cash: portfolio.balances.krw.totalAmount,
      riskless:
        portfolio.deposits.kr.totalAmount +
        portfolio.bonds.kr.totalPurchasePrice,
      stocks: kr.gain.marketValue,
    },
    jpy: {
      cash: portfolio.balances.jpy.totalAmount * jpy,
      stocks: jp.gain.marketValue * jpy,
    },
    housing: portfolio.housing.totalAmount,
    crypto: {
      stable: stableCoinMarketValue * usd,
      coins: (crypto.gain.marketValue - stableCoinMarketValue) * usd,
    },
    gold: 0,
    purpose: {
      usd: {
        cash: 5,
        riskless: 15,
        stocks: 45,
      },
      krw: {
        cash: 3,
        riskless: 4,
        stocks: 8,
      },
      jpy: {
        cash: 0.1,
        stocks: 0.9,
      },
      crypto: {
        stable: 0,
        coins: 2,
      },
      housing: 15,
      gold: 2,
    },
  };

  const simulate = createSimulation(
    portfolio,
    summary.principal,
    us,
    kr,
    jp,
    crypto,
    quotes.get('SPY')?.price,
    usd,
    jpy,
  );

  return {
    ...summary,
    ingredients,
    simulates:
      simulate &&
      portfolio.simulations.map((s) =>
        simulate(s.title, s.usdkrw, s.jpykrw, s.spy),
      ),
  };
}
