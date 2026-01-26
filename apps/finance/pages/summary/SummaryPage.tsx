import type { ReactNode } from 'react';
import { Page } from '../../Page.tsx';
import { FinanceSummarySection } from '../../sections/finance-summary/FinanceSummarySection.tsx';
import component from './SummaryPage.module.css';

export function SummaryPage(): ReactNode {
  return (
    <Page layout="scrollable" className={component.style}>
      <FinanceSummarySection />
    </Page>
  );
}
