import { useScreen } from '@ui/data-utils';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import 'react-data-grid/lib/styles.css';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { BodyKcalPage } from './pages/body.kcal/BodyKcalPage.tsx';
import { BodySummaryPage } from './pages/body/BodySummaryPage.tsx';
import { FXPage } from './pages/fx/FXPage.tsx';
import { HoldingsPage } from './pages/holdings/HoldingsPage.tsx';
import { JournalPage } from './pages/journal/JournalPage.tsx';
import { MarketPage } from './pages/market/MarketPage.tsx';
import { MoneybookEventPage } from './pages/moneybook.event/MoneybookEventPage.tsx';
import { MoneybookExpensesPage } from './pages/moneybook.expenses/MoneybookExpensesPage.tsx';
import { MoneybookSummaryPage } from './pages/moneybook/MoneybookSummaryPage.tsx';
import { MorePage } from './pages/more/MorePage.tsx';
import { PositionsPage } from './pages/positions/PositionsPage.tsx';
import { QuotePage } from './pages/quote/QuotePage.tsx';
import { SummaryPage } from './pages/summary/SummaryPage.tsx';
import { TradesPage } from './pages/trades/TradesPage.tsx';
import { WatchPage } from './pages/watch/WatchPage.tsx';
import './style.css';

export function App(): ReactNode {
  const { pathname } = useLocation();
  const { screen } = useScreen();

  useEffect(() => {
    document.querySelector('body')?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route
        path="/"
        Component={screen === 'desktop' ? MarketPage : SummaryPage}
      />
      <Route path="/holdings/*" Component={HoldingsPage} />
      <Route path="/quote/:symbol" Component={QuotePage} />
      <Route path="/trades/*" Component={TradesPage} />
      <Route path="/position/*" Component={PositionsPage} />
      <Route path="/market" Component={MarketPage} />
      <Route path="/watch" Component={WatchPage} />
      <Route path="/journal/*" Component={JournalPage} />
      <Route path="/body" Component={BodySummaryPage} />
      <Route path="/body/kcal" Component={BodyKcalPage} />
      <Route path="/moneybook" Component={MoneybookSummaryPage} />
      <Route path="/moneybook/expenses" Component={MoneybookExpensesPage} />
      <Route path="/moneybook/event/*" Component={MoneybookEventPage} />
      <Route path="/fx" Component={FXPage} />
      <Route path="/more" Component={MorePage} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
