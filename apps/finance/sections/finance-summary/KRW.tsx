import type { Iso8601, KRW as K, Portfolio } from '@iamssen/exocortex';
import { sumBondsGain, sumDepositsGain } from '@iamssen/exocortex/projector';
import { Format } from '@libs/format';
import { DateTime } from 'luxon';
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Fragment, useMemo } from 'react';
import { BondsGainList } from './BondsGainList.tsx';
import { BondsList } from './BondsList.tsx';
import { DepositsGainList } from './DepositsGainList.tsx';
import { ImpendCount } from './ImpendCount.tsx';

export interface KRWProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> {
  portfolio: Portfolio;
  view: 'simple' | 'detail';
}

function getCouponTax(amount: number): K {
  return (amount * 0.154) as K;
}

export function KRW({ portfolio, view, ...props }: KRWProps): ReactNode {
  const staledBondsGain = useMemo(() => {
    return new Map([
      [
        new Date().getFullYear(),
        sumBondsGain(
          portfolio.bonds.kr.list,
          DateTime.now().startOf('year').toISODate() as Iso8601,
          DateTime.now().toISODate() as Iso8601,
        ),
      ],
    ]);
  }, [portfolio.bonds.kr.list]);

  const staledDepositsGain = useMemo(() => {
    return new Map([
      [
        new Date().getFullYear(),
        sumDepositsGain(
          portfolio.deposits.kr.list,
          DateTime.now().startOf('year').toISODate() as Iso8601,
          DateTime.now().toISODate() as Iso8601,
        ),
      ],
    ]);
  }, [portfolio.deposits.kr.list]);

  return (
    <section {...props}>
      <dl>
        <dt>
          <strong>KRW</strong>
        </dt>
        <dd>
          <Format
            format="KRW"
            n={
              portfolio.balances.krw.totalAmount +
              portfolio.housing.totalAmount +
              portfolio.deposits.kr.totalAmount +
              portfolio.bonds.kr.totalPurchasePrice
            }
          />
        </dd>
        <dt>Balances</dt>
        <dd>
          <Format format="KRW" n={portfolio.balances.krw.totalAmount} />
        </dd>
        {view === 'detail' &&
          portfolio.balances.krw.list.map(({ name, amount }) => (
            <Fragment key={`krw-balance-${name}`}>
              <dt data-depth="1">{name}</dt>
              <dd>
                <Format format="KRW" n={amount} />
              </dd>
            </Fragment>
          ))}
        <dt>Deposits</dt>
        <dd>
          <Format format="KRW" n={portfolio.deposits.kr.totalAmount} />
        </dd>
        {view === 'simple' && (
          <DepositsGainList
            gain={portfolio.deposits.kr.gain}
            staledGain={staledDepositsGain}
            currency="KRW"
          />
        )}
        {view === 'detail' &&
          portfolio.deposits.kr.list.map(
            ({ name, end, amount, interestIncome }) => (
              <Fragment key={`kr-depogit-${name}-${end}`}>
                <dt data-depth="1">
                  <time dateTime={end}>
                    {end} <ImpendCount date={end} />
                  </time>
                </dt>
                <dd>
                  <Format format="KRW" n={amount} />
                </dd>
                <dt data-depth="2"></dt>
                <dd>
                  +<Format format="KRW" n={interestIncome} />
                </dd>
              </Fragment>
            ),
          )}
        <dt>Bonds</dt>
        <dd>
          <Format format="KRW" n={portfolio.bonds.kr.totalAmount} />
        </dd>
        {view === 'simple' && (
          <BondsGainList
            gain={portfolio.bonds.kr.gain}
            staledGain={staledBondsGain}
            currency="KRW"
          />
        )}
        {view === 'detail' && (
          <BondsList
            list={portfolio.bonds.kr.list}
            currency="KRW"
            getCouponTax={getCouponTax}
          />
        )}
        <dt>Housing</dt>
        <dd>
          <Format format="KRW" n={portfolio.housing.totalAmount} />
        </dd>
      </dl>
    </section>
  );
}
