import type { BondsGain } from '@iamssen/exocortex';
import type { CollapseYearsResult } from '@iamssen/exocortex/date-utils';
import { collapseYears } from '@iamssen/exocortex/date-utils';
import type { CurrencyType } from '@libs/format';
import { Format } from '@libs/format';
import type { ReactNode } from 'react';
import { Fragment, useMemo } from 'react';

export interface BondsGainListProps {
  gain: BondsGain[];
  staledGain: Map<number, { maturityGain: number; couponsGain: number }>;
  currency: CurrencyType;
}

const filterFromYear = new Date().getFullYear();
const reduceFromYear = filterFromYear + 3;

export function BondsGainList({
  gain,
  staledGain,
  currency,
}: BondsGainListProps): ReactNode {
  const { list, collapsed } = useMemo(
    () => collapseYears(gain, 'year', filterFromYear, reduceFromYear),
    [gain],
  );

  return (
    <>
      {list.map(({ year, couponGain, maturityGain }) => (
        <Fragment key={`bonds-gain-${year}`}>
          <dt data-depth="1">{year}</dt>
          <dd>
            {staledGain.has(year) &&
              ((staledGain.get(year)?.maturityGain ?? 0) > 0 ||
                (staledGain.get(year)?.couponsGain ?? 0) > 0) && (
                <>
                  <Format
                    format={currency}
                    n={
                      (staledGain.get(year)?.maturityGain ?? 0) +
                      (staledGain.get(year)?.couponsGain ?? 0)
                    }
                  />
                  {' / '}
                </>
              )}
            <Format format={currency} n={couponGain + maturityGain} />
          </dd>
        </Fragment>
      ))}
      {collapsed && <Collapsed currency={currency} {...collapsed} />}
    </>
  );
}

function Collapsed({
  from,
  to,
  list,
  currency,
}: NonNullable<CollapseYearsResult<BondsGain>['collapsed']> & {
  currency: CurrencyType;
}) {
  const { couponGain, maturityGain } = useMemo(
    () =>
      list.reduce(
        (acc, item) => ({
          couponGain: acc.couponGain + item.couponGain,
          maturityGain: acc.maturityGain + item.maturityGain,
        }),
        { couponGain: 0, maturityGain: 0 },
      ),
    [list],
  );

  return (
    <>
      <dt data-depth="1">
        {from} ~ {to}
      </dt>
      <dd>
        <Format format={currency} n={couponGain + maturityGain} />
      </dd>
    </>
  );
}
