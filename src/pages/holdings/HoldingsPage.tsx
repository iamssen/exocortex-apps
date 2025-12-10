import { FormatConfig } from '@iamssen/exocortex-appkit/format';
import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Page } from '../../Page.tsx';
import styles from './HoldingsPage.module.css';
import { View } from './View.tsx';

export function HoldingsPage(): ReactNode {
  const { data: usdkrw } = useQuery(api('finance/quote/KRW=X'));
  const { data: jpykrw } = useQuery(api('finance/quote/JPYKRW=X'));

  return (
    <Page layout="fixed" className={styles.article}>
      <FormatConfig krwShortUnits>
        <Routes>
          <Route
            path="us"
            element={
              <View market="us" currency="USD" krwExchangeRate={usdkrw} />
            }
          />
          <Route
            path="kr"
            element={<View market="kr" currency="KRW" printDisplayName />}
          />
          <Route
            path="jp"
            element={
              <View
                market="jp"
                currency="JPY"
                krwExchangeRate={jpykrw}
                printDisplayName
              />
            }
          />
          <Route path="fx" element={<View market="fx" currency="KRW" />} />
          <Route
            path="crypto"
            element={
              <View market="crypto" currency="USD" krwExchangeRate={usdkrw} />
            }
          />
          <Route path="*" element={<Navigate replace to="us" />} />
        </Routes>
      </FormatConfig>
    </Page>
  );
}
