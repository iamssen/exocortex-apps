import type { DepositsGain } from '@iamssen/exocortex';
import type { CollapseYearsResult } from '@iamssen/exocortex/date-utils';
import { collapseYears } from '@iamssen/exocortex/date-utils';
import type { CurrencyType } from '@libs/format';
import { Format } from '@libs/format';
import type { ReactNode } from 'react';
import { Fragment, useMemo } from 'react';

export interface DepositsGainListProps {
  gain: DepositsGain[];
  staledGain: Map<number, { interestGain: number }>;
  currency: CurrencyType;
}

const filterFromYear = new Date().getFullYear();
const reduceFromYear = filterFromYear + 3;

export function DepositsGainList({
  gain,
  staledGain,
  currency,
}: DepositsGainListProps): ReactNode {
  const { list, collapsed } = useMemo(
    () => collapseYears(gain, 'year', filterFromYear, reduceFromYear),
    [gain],
  );

  return (
    <>
      {list.map(({ year, interestGain }) => (
        <Fragment key={`deposits-gain-${year}`}>
          <dt data-depth="1">{year}</dt>
          <dd>
            {staledGain.has(year) &&
              (staledGain.get(year)?.interestGain ?? 0) > 0 && (
                <>
                  <Format
                    format={currency}
                    n={staledGain.get(year)?.interestGain}
                  />
                  {' / '}
                </>
              )}
            <Format format={currency} n={interestGain} />
          </dd>
        </Fragment>
      ))}
      {collapsed && <Collapsed {...collapsed} currency={currency} />}
    </>
  );
}

function Collapsed({
  from,
  to,
  list,
  currency,
}: NonNullable<CollapseYearsResult<DepositsGain>['collapsed']> & {
  currency: CurrencyType;
}) {
  const { interestGain } = useMemo(
    () =>
      list.reduce(
        (acc, item) => ({
          interestGain: acc.interestGain + item.interestGain,
        }),
        { interestGain: 0 },
      ),
    [list],
  );

  return (
    <>
      <dt data-depth="1">
        {from} ~ {to}
      </dt>
      <dd>
        <Format format={currency} n={interestGain} />
      </dd>
    </>
  );
}
