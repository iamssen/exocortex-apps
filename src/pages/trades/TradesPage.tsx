import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router';
import { TradeHistoryPage } from './TradeHistoryPage.tsx';
import { TradesListPage } from './TradesListPage.tsx';

export function TradesPage(): ReactNode {
  return (
    <Routes>
      <Route index Component={TradesListPage} />
      <Route
        path="us"
        element={
          <TradeHistoryPage market="us" currency="USD" benchmarkSymbol="SPY" />
        }
      />
      <Route
        path="kr"
        element={
          <TradeHistoryPage
            market="kr"
            currency="KRW"
            benchmarkSymbol="SPY"
            printDisplayName
          />
        }
      />
      <Route
        path="jp"
        element={
          <TradeHistoryPage
            market="jp"
            currency="JPY"
            benchmarkSymbol="SPY"
            printDisplayName
          />
        }
      />
      <Route
        path="fx"
        element={
          <TradeHistoryPage market="fx" currency="KRW" benchmarkSymbol="SPY" />
        }
      />
      <Route
        path="crypto"
        element={
          <TradeHistoryPage
            market="crypto"
            currency="USD"
            benchmarkSymbol="SPY"
          />
        }
      />
    </Routes>
  );
}
