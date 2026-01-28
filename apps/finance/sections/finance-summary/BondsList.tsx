import type { Bond, KRW } from '@iamssen/exocortex';
import type { CurrencyType } from '@libs/format';
import { Format } from '@libs/format';
import { DateTime } from 'luxon';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { ImpendCount } from './ImpendCount.tsx';

export interface BondsListProps {
  list: Bond[];
  currency: CurrencyType;
  getCouponTax?: (amount: number) => KRW;
}

export function BondsList({
  list,
  currency,
  getCouponTax,
}: BondsListProps): ReactNode {
  return (
    <>
      {list.map(({ name, maturityDate, amount, purchasePrice, coupons }) => (
        <Fragment key={`${name}-${maturityDate}`}>
          <dt data-depth="1">
            <time dateTime={maturityDate}>{maturityDate}</time>
          </dt>
          <dd>
            <Format format={currency} n={amount} />
            <sub style={{ opacity: 0.5 }}>
              {' - '}
              <Format format={currency} n={purchasePrice} />
            </sub>
          </dd>
          {coupons.map((coupon, i) => (
            <Fragment
              key={`coupon-${name}-${maturityDate}-${coupon.date}-${i}`}
            >
              <dt
                data-depth="2"
                data-stale={
                  DateTime.fromISO(coupon.date).diffNow('days').days < 0
                }
              >
                <time dateTime={coupon.date}>
                  {coupon.date} <ImpendCount date={coupon.date} />
                </time>
              </dt>
              <dd>
                <Format format={currency} n={coupon.amount} />
                {typeof getCouponTax === 'function' && (
                  <sub style={{ opacity: 0.8 }}>
                    {' '}
                    (<Format format="KRW" n={getCouponTax(coupon.amount)} />)
                  </sub>
                )}
              </dd>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}
