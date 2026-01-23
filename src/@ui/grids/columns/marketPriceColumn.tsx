import type { MarketState } from '@iamssen/exocortex';
import { Format } from '@iamssen/exocortex-appkit/format';
import type { ValueSelector } from '@iamssen/exocortex-appkit/react-data-grid';
import {
  cellStyles,
  selectValue,
} from '@iamssen/exocortex-appkit/react-data-grid';
import clsx from 'clsx/lite';
import type { Column } from 'react-data-grid';
import { MdOutlineWbSunny, MdOutlineWbTwilight } from 'react-icons/md';

interface C<Row> extends Omit<Column<Row>, 'renderCell'> {
  format: string;
  selectMarketState: ValueSelector<Row, MarketState>;
  selectPrice: ValueSelector<Row, number>;
}

export function marketPriceColumn<Row>({
  format: f,
  selectMarketState: sm,
  selectPrice: sp,
  cellClass,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const marketState = selectValue(row, sm);
      const price = selectValue(row, sp);
      return (
        <>
          <data value={marketState} style={{ transform: 'translateY(0.1em)' }}>
            {marketState === 'PRE' ? (
              <MdOutlineWbTwilight />
            ) : marketState === 'REGULAR' ? (
              <MdOutlineWbSunny />
            ) : null}
          </data>
          <Format format={f} n={price} replacer="-" />
        </>
      );
    },
    cellClass: (row) => {
      return clsx(
        cellStyles.cellSpaceBetween,
        typeof cellClass === 'function' ? cellClass(row) : cellClass,
      );
    },
    ...options,
  };
}
