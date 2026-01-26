import { useQuery } from '@tanstack/react-query';
import type { PriceLineData } from '@ui/cartesian-chart';
import { useKospiPeChart } from '@ui/charts';
import {
  OutLink,
  SingleDateSelect,
  toDateItem,
  useSingleDateState,
} from '@ui/components';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { benchmarkStartDates, quoteStartDates } from '../../env.ts';
import { Page } from '../../Page.tsx';
import { dDays } from './d-days.ts';
import styles from './MarketPage.module.css';
import { BenchmarkSection } from './sections/BenchmarkSection.tsx';
import { KospiPeSection } from './sections/KospiPeSection.tsx';
import { PeAndYieldSection } from './sections/PeAndYieldSection.tsx';
import { QuoteSection } from './sections/QuoteSection.tsx';

const symbols = [
  'DX-Y.NYB',
  '^GSPC',
  '^IXIC',
  '^SOX',
  'VNQ',
  'GLD',
  '^TNX',
  '^FVX',
  '^KS11',
  '^KQ11',
  '^N225',
];

const shillerPeWatches: PriceLineData[] = [
  { price: 26, watchFor: 'low' },
  { price: 35, watchFor: 'high' },
];
const sp500PeWatches: PriceLineData[] = [
  { price: 19, watchFor: 'low' },
  { price: 30, watchFor: 'high' },
];
const kospiPeWatches: PriceLineData[] = [
  { price: 9, watchFor: 'low' },
  { price: 20, watchFor: 'high' },
];

interface FredConfig {
  series: string;
  formatString: string;
  title: string;
  watches?: PriceLineData[];
  durationInDays?: number;
}

const QUATER = 90;

const fred: FredConfig[] = [
  {
    title: 'REVERSE REPO',
    series: 'RRPONTSYD',
    formatString: 'KRW=X',
    watches: [{ price: 100, watchFor: 'low', formatString: 'KRW=X' }],
  },
  {
    title: '10Y REAL INTEREST RATE',
    series: 'REAINTRATREARAT10Y',
    formatString: 'PERCENT',
    watches: [{ price: 2.5, watchFor: 'high', formatString: 'PERCENT' }],
  },
  {
    title: '1Y REAL INTEREST RATE',
    series: 'REAINTRATREARAT1YE',
    formatString: 'PERCENT',
  },
  {
    title: '1M REAL INTEREST RATE',
    series: 'REAINTRATREARAT1MO',
    formatString: 'PERCENT',
  },
  {
    title: 'BUSINESS LOAN DELINQ. RATE',
    series: 'DRBLACBS',
    formatString: 'PERCENT',
    watches: [
      { price: 3, watchFor: 'high', formatString: 'PERCENT' },
      { price: 0.5, watchFor: 'low', formatString: 'PERCENT' },
    ],
    durationInDays: QUATER,
  },
  {
    title: 'CREDIT CARD LOAN DELINQ. RATE',
    series: 'DRCCLACBS',
    formatString: 'PERCENT',
    watches: [
      { price: 5, watchFor: 'high', formatString: 'PERCENT' },
      { price: 2, watchFor: 'low', formatString: 'PERCENT' },
    ],
    durationInDays: QUATER,
  },
  {
    title: 'REAL ESTATE LOAN DELINQ. RATE',
    series: 'DRSREACBS',
    formatString: 'PERCENT',
    watches: [
      { price: 5, watchFor: 'high', formatString: 'PERCENT' },
      { price: 1, watchFor: 'low', formatString: 'PERCENT' },
    ],
    durationInDays: QUATER,
  },
  {
    title: 'COMMERCIAL REAL ESTATE PRICES',
    series: 'COMREPUSQ159N',
    formatString: 'PERCENT_SIGN',
    watches: [{ price: -10, watchFor: 'low', formatString: 'PERCENT_SIGN' }],
    durationInDays: QUATER,
  },
  {
    title: 'ALL LOAN DELINQ. RATE',
    series: 'DRALACBN',
    formatString: 'PERCENT',
    watches: [
      { price: 3, watchFor: 'high', formatString: 'PERCENT' },
      { price: 1, watchFor: 'low', formatString: 'PERCENT' },
    ],
    durationInDays: QUATER,
  },
  {
    title: 'HIGH YIELD SPREAD',
    series: 'BAMLH0A0HYM2',
    formatString: 'PERCENT',
    watches: [
      { price: 5, watchFor: 'high', formatString: 'PERCENT' },
      { price: 3, watchFor: 'low', formatString: 'PERCENT' },
    ],
  },
  {
    title: 'UNEMPLOYMENT RATE',
    series: 'UNRATE',
    formatString: 'PERCENT',
    watches: [
      { price: 5, watchFor: 'high', formatString: 'PERCENT' },
      { price: 3, watchFor: 'low', formatString: 'PERCENT' },
    ],
  },
  {
    title: 'NEW HOUSING STARTS',
    series: 'HOUST',
    formatString: 'KRW=X',
    watches: [
      { price: 1700, watchFor: 'high', formatString: 'KRW=X' },
      { price: 700, watchFor: 'low', formatString: 'KRW=X' },
    ],
  },
  {
    title: 'LOANS AND LEASES',
    series: 'LOANSNSA',
    formatString: 'KRW=X',
  },
  {
    title: 'DEPOSITS',
    series: 'DPSACBW027SBOG',
    formatString: 'KRW=X',
  },
];

export function MarketPage(): ReactNode {
  const chartStartDates = useMemo(() => quoteStartDates.map(toDateItem), []);

  const [benchmarkStartDate, setBenchmarkStartDate] = useSingleDateState(
    'market_benchmark_start_date',
    benchmarkStartDates,
    ({ label }) => label === 'Y2010',
  );

  const [chartStartDate, setChartStartDate] = useSingleDateState(
    'market_chart_start_date',
    chartStartDates,
    ({ label }) => label === 'CORONA',
  );

  const { data: marginDebt } = useQuery(api('finance/margin-debt'));
  const { data: buffettIndicator } = useQuery(api('finance/buffett-indicator'));
  const { data: fearAndGreed } = useQuery(api('finance/fear-and-greed'));
  const { data: peAndYields } = useQuery(
    api('finance/pe-and-yields', {}, { select: (d) => d }),
  );

  const kospiPe = useKospiPeChart(kospiPeWatches, benchmarkStartDate.value);

  return (
    <Page layout="scrollable" className={styles.container}>
      <header className={styles.values}>
        {fearAndGreed && (
          <a href={fearAndGreed.link} rel="noreferrer" target="_blank">
            <h3>Fear and Greed</h3>
            <data value={fearAndGreed.rating}>
              {fearAndGreed.rating.toUpperCase()}
              <sub>
                {' : '}
                {fearAndGreed.fearAndGreed.at(-1)?.value.toFixed(0)}
              </sub>
            </data>
            <time dateTime={fearAndGreed.date}>{fearAndGreed.date}</time>
          </a>
        )}
        {marginDebt && (
          <a href={marginDebt.link} rel="noreferrer" target="_blank">
            <h3>Margin Debt</h3>
            <data value={marginDebt.value.toLowerCase()}>
              {marginDebt.value.toUpperCase()}
            </data>
            <time dateTime={marginDebt.date}>{marginDebt.date}</time>
          </a>
        )}
        {buffettIndicator && (
          <a href={buffettIndicator.link} rel="noreferrer" target="_blank">
            <h3>Buffett Indicator</h3>
            <data value={buffettIndicator.value.toLowerCase()}>
              {buffettIndicator.value.toUpperCase()}
            </data>
            <time dateTime={buffettIndicator.date}>
              {buffettIndicator.date}
            </time>
          </a>
        )}
        {dDays.map(({ link, name, day, dday }) => (
          <a key={`d-day-${day}`} href={link} rel="noreferrer" target="_blank">
            <h3>{name}</h3>
            <data value={dday}>
              D{dday <= 0 ? '+' : '-'}
              {Math.abs(dday)}
            </data>
            <time dateTime={day}>{day}</time>
          </a>
        ))}
      </header>

      <SingleDateSelect
        className={styles.dateSelection}
        dates={chartStartDates}
        selectedDate={chartStartDate}
        onChange={setChartStartDate}
      />

      <section className={styles.grid}>
        {symbols.map((symbol, i) => (
          <QuoteSection
            key={symbol}
            symbol={symbol}
            chartStart={chartStartDate.value}
            observeIntersection={i > 8}
          />
        ))}
      </section>

      {peAndYields && <PeAndYieldSection data={peAndYields} />}

      <SingleDateSelect
        className={styles.dateSelection}
        dates={benchmarkStartDates}
        selectedDate={benchmarkStartDate}
        onChange={setBenchmarkStartDate}
      />

      <section className={styles.grid}>
        <BenchmarkSection
          benchmark="finance/shiller-pe"
          start={benchmarkStartDate.value}
          watches={shillerPeWatches}
        >
          <OutLink href="https://www.multpl.com/shiller-pe">
            Shiller P/E
          </OutLink>
        </BenchmarkSection>
        <BenchmarkSection
          benchmark="finance/sp500-pe"
          start={benchmarkStartDate.value}
          watches={sp500PeWatches}
        >
          <OutLink href="https://www.multpl.com/s-p-500-pe-ratio">
            S&P500 P/E
          </OutLink>
        </BenchmarkSection>
        <BenchmarkSection
          formatString="KRW=X"
          benchmark="finance/sp500-earnings"
          start={benchmarkStartDate.value}
        >
          <OutLink href="https://www.multpl.com/s-p-500-earnings">
            S&P500 EARNINGS
          </OutLink>
        </BenchmarkSection>

        {...fred.map(
          ({ series, formatString, title, watches, durationInDays }) => (
            <BenchmarkSection
              key={series}
              formatString={formatString}
              benchmark={`finance/fred/${series}`}
              start={benchmarkStartDate.value}
              watches={watches}
              durationInDays={durationInDays}
            >
              <OutLink href={`https://fred.stlouisfed.org/series/${series}`}>
                {title}
              </OutLink>
            </BenchmarkSection>
          ),
        )}

        <KospiPeSection chart={kospiPe}>
          <OutLink href="https://kosis.kr/statHtml/statHtml.do?orgId=343&tblId=DT_343_2010_S0033">
            KOSPI200 P/E
          </OutLink>
        </KospiPeSection>
      </section>
    </Page>
  );
}
