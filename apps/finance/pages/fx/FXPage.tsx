import { scaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { Page } from '../../Page.tsx';
import styles from './FXPage.module.css';
import { FXTable } from './FXTable.tsx';
import { FXTableRow } from './FXTableRow.tsx';

const fxCellColor = scaleLinear<string, string>()
  .domain([-0.05, 0, 0.05])
  .range(['green', 'rgba(0, 0, 0, 0)', 'blue'])
  .clamp(true);

const stockCellColor = scaleLinear<string, string>()
  .domain([-0.3, 0, 0.3])
  .range(['green', 'rgba(0, 0, 0, 0)', 'blue'])
  .clamp(true);

export function FXPage(): ReactNode {
  return (
    <Page layout="scrollable" className={styles.container}>
      <FXTable title="KRW" format="KRW" cellColor={fxCellColor}>
        <FXTableRow symbol="KRW=X" displayName="USD" />
        <FXTableRow symbol="JPYKRW=X" displayName="JPY" />
        <FXTableRow symbol="EURKRW=X" displayName="EUR" />
        <FXTableRow symbol="TWDKRW=X" displayName="TWD" />
        <FXTableRow symbol="CNYKRW=X" displayName="CNY" />
        <FXTableRow symbol="THBKRW=X" displayName="THB" />
        <FXTableRow symbol="MYRKRW=X" displayName="MYR" />
      </FXTable>

      <FXTable title="JPY" format="JPY" cellColor={fxCellColor}>
        <FXTableRow symbol="JPY=X" displayName="USD" />
        <FXTableRow symbol="KRWJPY=X" displayName="KRW" />
        <FXTableRow symbol="EURJPY=X" displayName="EUR" />
        <FXTableRow symbol="TWDJPY=X" displayName="TWD" />
        <FXTableRow symbol="CNYJPY=X" displayName="CNY" />
        <FXTableRow symbol="THBJPY=X" displayName="THB" />
        <FXTableRow symbol="MYRJPY=X" displayName="MYR" />
      </FXTable>

      <FXTable title="USD" format="USD" cellColor={fxCellColor}>
        <FXTableRow symbol="KRWUSD=X" displayName="KRW" />
        <FXTableRow symbol="JPYUSD=X" displayName="JPY" />
        <FXTableRow symbol="EURUSD=X" displayName="EUR" />
        <FXTableRow symbol="TWDUSD=X" displayName="TWD" />
        <FXTableRow symbol="CNYUSD=X" displayName="CNY" />
        <FXTableRow symbol="THBUSD=X" displayName="THB" />
        <FXTableRow symbol="MYRUSD=X" displayName="MYR" />
      </FXTable>

      <FXTable title="MARKET" format="USD" cellColor={stockCellColor}>
        <FXTableRow symbol="SPY" />
        <FXTableRow symbol="QQQ" />
        <FXTableRow symbol="DIA" />
        <FXTableRow symbol="SCHD" />
        <FXTableRow symbol="JEPI" />
        <FXTableRow symbol="BRK-B" />
        <FXTableRow symbol="GLD" />
        <FXTableRow symbol="BTC-USD" />
        <FXTableRow symbol="ETH-USD" />
      </FXTable>
    </Page>
  );
}
